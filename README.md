# QuickNick

![QuickNick](https://i.imgur.com/rTttO8T.png)

A Discord bot that lets users change their nickname by simply sending a message in a specific channel.

## Features
- Change your nickname by sending a message in a designated channel
- Role-based permission system (allow specific roles to use the feature)
- Slash commands for configuration and logs
- Persistent settings and logs using Enmap
- Logging of nickname changes

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/atifahmed9461/QuickNick.git
   cd QuickNick
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file:**
   ```env
   TOKEN=your_discord_bot_token
   CHANNEL_ID=default_channel_id
   REACTION_EMOJI=✅
   ```
4. **Configure `config.js` as needed:**
   - Set up role-based permissions:
     ```js
     nickname_role_require: {
       enabled: true,
       role_ids: ['ROLE_ID_1', 'ROLE_ID_2']
     }
     ```

## Usage
- **Change Nickname:**
  - Send a message in the configured channel. The bot will set your nickname to the message content (if you have permission).

- **Slash Commands:**
  - `/setchannel <channel>` — Set the allowed channel for nickname changes
  - `/setemoji <emoji>` — Set the reaction emoji
  - `/config` — Show current bot configuration
  - `/log` — Show recent nickname change logs

> Only users with the `ManageGuild` or `Administrator` permission can use the slash commands.

## Logging
- Nickname changes are logged in a channel named `nickname-logs` and also stored in the database.

## Credits
- Built with [discord.js](https://discord.js.org/) and [Enmap](https://enmap.evie.dev/)

---
Feel free to contribute or open issues on GitHub!

## Support Server
Join our Discord for help and community support: https://discord.gg/tsbBKz2k53

## Creator
Created by Atif Ahmed 🖤 