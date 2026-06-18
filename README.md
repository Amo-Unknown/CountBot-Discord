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



# بات شمارش اعداد
## دستورات
 `/setup #channel` | چنل شمارش رو ست کن |
 `/chnumber <1–9>` | تعداد شمارش رو عوض کن (مثلا ۳ تا ۳ تا) |

 هر دو دستور نیاز به یکی از این پرمیشن‌ها دارن: Manage Messages، Manage Events، Manage Guild، یا Administrator.

## نحوه کار
- ممبر ها باید اعداد رو به ترتیب توی چنل بفرستن.
- ❌ عدد اشتباه = ریکشن + ریپلای، بازی ریست میشه.

## راه اندازی بات
```

open terminal in vsc or cd count-bot
npm install
cp .env.example .env   # توکن بات رو اضافه کن
npm start
```

## Developer Portal
- **Bot Intents:** `MESSAGE CONTENT INTENT` ✅
- **Scopes:** `bot`، `applications.commands`
- **Permissions:** Read Messages، Send Messages، Add Reactions، Read Message History

## License
MIT