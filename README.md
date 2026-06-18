# Count Bot 🔢

A Discord counting mini-game bot with customizable step increments.

## Commands
`/setup #channel` | Set the counting channel |
 `/chnumber <1–9>` | Change the counting step (e.g. count by 3s) |

Both commands require one of: Manage Messages, Manage Events, Manage Guild, or Administrator.

## How it works
- Members send numbers in the counting channel in order.
- ✅ Correct number → reaction only, game continues.
- ❌ Wrong number → reaction + reply, game resets from 0.

## Quick Start
```
open terminal in vsc or open terminal
npm install
cp .env.example .env   # add your bot token
npm start
```

## Developer Portal Settings
- **Bot Intents:** `MESSAGE CONTENT INTENT` 
- **Scopes:** `bot`, `applications.commands`
- **Permissions:** Read Messages, Send Messages, Add Reactions, Read Message History

---
## if you have problem or question send a message in discord @amounknown.
