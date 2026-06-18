const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// In-memory store: guildId -> { channelId, step, currentCount, lastUserId }
const gameState = new Map();

// --- Register slash commands on startup ---
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Set the counting channel for this server')
      .addChannelOption(opt =>
        opt.setName('channel').setDescription('The channel to use for counting').setRequired(true)
      ),

    new SlashCommandBuilder()
      .setName('chnumber')
      .setDescription('Change the counting step (e.g. count by 3s, 5s, up to 9)')
      .addIntegerOption(opt =>
        opt
          .setName('step')
          .setDescription('How much to increment each time (1–9)')
          .setMinValue(1)
          .setMaxValue(9)
          .setRequired(true)
      ),
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Slash commands registered globally.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
});

// --- Helper: check if member has any of the required permissions ---
function hasRequiredPermission(member) {
  const required = [
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.ManageEvents,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.Administrator,
  ];
  return required.some(perm => member.permissions.has(perm));
}

// --- Slash command handling ---
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, guildId, member } = interaction;

  // /setup - any admin can set the counting channel
  if (commandName === 'setup') {
    if (!hasRequiredPermission(member)) {
      return interaction.reply({
        content: '❌ You need **Manage Messages**, **Manage Events**, **Manage Guild**, or **Administrator** permission to use this command.',
        ephemeral: true,
      });
    }

    const channel = interaction.options.getChannel('channel');
    const existing = gameState.get(guildId) || {};

    gameState.set(guildId, {
      channelId: channel.id,
      step: existing.step || 1,
      currentCount: 0,
      lastUserId: null,
    });

    return interaction.reply({
      content: `✅ Counting channel set to ${channel}. Game starts from **0**. Next number: **${existing.step || 1}**.`,
      ephemeral: false,
    });
  }

  // /chnumber - change the counting step
  if (commandName === 'chnumber') {
    if (!hasRequiredPermission(member)) {
      return interaction.reply({
        content: '❌ You need **Manage Messages**, **Manage Events**, **Manage Guild**, or **Administrator** permission to use this command.',
        ephemeral: true,
      });
    }

    const step = interaction.options.getInteger('step');

    // step is already validated 1-9 by Discord's min/max, but double-check
    if (step < 1 || step > 9) {
      return interaction.reply({
        content: '❌ Step must be between **1** and **9**.',
        ephemeral: true,
      });
    }

    const existing = gameState.get(guildId);

    if (!existing) {
      return interaction.reply({
        content: '⚠️ No counting channel set yet. Use `/setup` first.',
        ephemeral: true,
      });
    }

    // Reset the game with new step
    gameState.set(guildId, {
      channelId: existing.channelId,
      step,
      currentCount: 0,
      lastUserId: null,
    });

    return interaction.reply({
      content: `🔄 Counting step changed to **${step}**. Game has been reset! Next number: **${step}**.`,
      ephemeral: false,
    });
  }
});

// --- Message handling for counting ---
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const state = gameState.get(message.guildId);
  if (!state) return;
  if (message.channelId !== state.channelId) return;

  const { step, currentCount } = state;
  const expectedNext = currentCount + step;
  const input = parseInt(message.content.trim(), 10);

  // Not a number → ignore silently
  if (isNaN(input)) return;

  if (input === expectedNext) {
    // ✅ Correct
    state.currentCount = expectedNext;
    state.lastUserId = message.author.id;
    gameState.set(message.guildId, state);

    try {
      await message.react('✅');
    } catch (_) {}
  } else {
    // ❌ Wrong number
    try {
      await message.react('❌');
    } catch (_) {}

    try {
      await message.reply(
        `❌ **Wrong number!** The expected number was **${expectedNext}** (counting by ${step}s).\n🔄 Game has been reset! Next number: **${step}**.`
      );
    } catch (_) {}

    // Reset game
    gameState.set(message.guildId, {
      channelId: state.channelId,
      step: state.step,
      currentCount: 0,
      lastUserId: null,
    });
  }
});

client.login(process.env.TOKEN);
