const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();
const config = require('./config');
const Enmap = require('enmap');
const figlet = require("figlet");
const colors = require('colors');
const chalk = require('chalk');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
});

figlet("QuickNick", function (err, data) {
    if (err) {
      console.log("[Figlet] :: Something went wrong...".red);
      console.dir(err);
      return;
    }
    console.log(data);
  });

const botConfig = new Enmap({ name: 'config' });
const botLogs = new Enmap({ name: 'logs' });

client.once("ready", async () => {
    const color1 = chalk.hex('#646464')
    let client_user = client.user.displayName;
    console.log(`[Nickname] :: Nickname is ready... `.green);
    
    console.log(`[Slash] :: Slash commands are ready... `.blue);

    console.log(color1(`[${client_user}] :: Username: ${client.user.username}`));
    console.log(color1(`[${client_user}] :: Tag: ${client.user.tag}`));
    console.log(color1(`[${client_user}] :: ID: ${client.user.id}`));
    console.log(color1(`[${client_user}] :: Server: ${client.guilds.cache.size}`));
    console.log(color1(`[${client_user}] :: Users: ${client.users.cache.size}`));

    client.user.setStatus(config.status);
    client.user.setActivity({ name: config.activityName, type: config.activityType });

    for (const guild of client.guilds.cache.values()) {
        await guild.commands.set([
            {
                name: 'setchannel',
                description: 'Set the allowed channel for nickname changes',
                options: [
                    {
                        name: 'channel',
                        type: 7,
                        description: 'Channel to allow nickname changes',
                        required: true
                    }
                ]
            },
            {
                name: 'setemoji',
                description: 'Set the reaction emoji',
                options: [
                    {
                        name: 'emoji',
                        type: 3,
                        description: 'Emoji to react with',
                        required: true
                    }
                ]
            },
            {
                name: 'config',
                description: 'Show current bot config'
            },
            {
                name: 'log',
                description: 'Show recent nickname change logs'
            }
        ]);
    }
});

const LOG_CHANNEL_NAME = '丨ɴɪᴄᴋɴᴀᴍᴇ-ʟᴏɢs';

function validateNickname(nick) {
    if (!nick) return { valid: false, reason: 'Nickname cannot be empty.' };
    if (nick.length < 2) return { valid: false, reason: 'Nickname too short (min 2 chars).' };
    if (nick.length > 32) return { valid: false, reason: 'Nickname too long (max 32 chars).' };
    if (/[@#:```]/.test(nick)) return { valid: false, reason: 'Nickname contains invalid characters.' };
    return { valid: true };
}

function hasPermission(member) {
    if (config.nickname_role_require && config.nickname_role_require.enabled) {
        return config.nickname_role_require.role_ids.some(roleId => member.roles.cache.has(roleId));
    }
    return true;
}

function hasAdminPermission(member) {
    return member.permissions.has('Administrator') || member.permissions.has('ManageGuild');
}

async function logNicknameChange(guild, user, oldNick, newNick) {
    let logChannel = guild.channels.cache.find(c => c.name === LOG_CHANNEL_NAME && c.isTextBased());
    if (!logChannel) return;
    await logChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`**${user.tag}** changed nickname: \`${oldNick || user.username}\` → \`${newNick}\``)
        ]
    });
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName, options, member } = interaction;
    if (["setchannel", "setemoji", "config", "log"].includes(commandName)) {
        if (!hasAdminPermission(member)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }
    }
    if (commandName === 'setchannel') {
        const channel = options.getChannel('channel');
        botConfig.set('channelId', channel.id);
        await interaction.reply(`Allowed channel set to <#${channel.id}>`);
    } else if (commandName === 'setemoji') {
        const emoji = options.getString('emoji');
        botConfig.set('reactionEmoji', emoji);
        await interaction.reply(`Reaction emoji set to ${emoji}`);
    } else if (commandName === 'config') {
        const channelId = botConfig.get('channelId') || config.channelId;
        const emoji = botConfig.get('reactionEmoji') || config.reactionEmoji;
        await interaction.reply(`Current config:\nAllowed channel: <#${channelId}>\nReaction emoji: ${emoji}`);
    } else if (commandName === 'log') {
        const logs = botLogs.get('nicknames') || [];
        if (logs.length === 0) return interaction.reply('No logs found.');
        const lastLogs = logs.slice(-5).map(log => `**${log.user}**: \
\`${log.oldNick || 'none'}\` → \`${log.newNick}\` at <t:${Math.floor(log.time/1000)}:R>`).join('\n');
        await interaction.reply({ content: `Recent nickname changes:\n${lastLogs}`, ephemeral: true });
    }
});



client.on('guildMemberAdd', async (member) => {
    const welcomeChannel = member.guild.channels.cache.get('1530566105792254084');

    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle(`Standby for ${member.user.username}’s Arrival.`)
        .setThumbnail('https://cdn.discordapp.com/attachments/1530429717063274577/1530568841145618623/image.png')
        .setDescription(`
Standby for ${member}’s Arrival.

╭━━━━━━━━━━━━━━━━━━╮
        WELCOME
      THE ELYSIUM
╰━━━━━━━━━━━━━━━━━━╯

You have entered **THE ELYSIUM**.

A place built on loyalty, discipline, and ambition.
Every member carries the name and contributes to the legacy.

「 START HERE 」

✦ Read the rules
✦ Check the information
✦ Choose your path
✦ Prepare for your journey

Your story begins now.

— THE ELYSIUM
        `)
        .setImage('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDlxd2Nmcm02enBxcGF1dTVtM2QxaWszZG0zbjVkczN2cGdkcnkzcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kjMZRr2pgdkTEdLjmK/giphy.gif')
        .setFooter({ text: '© THE ELYSIUM' })
        .setTimestamp();

    await welcomeChannel.send({
        embeds: [embed]
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const allowedChannelId = botConfig.get('channelId') || config.channelId;
    if (message.channel.id !== allowedChannelId) return;
    if (!message.member) return;

    if (!hasPermission(message.member)) {
        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('You do not have permission to change nicknames.')
            ]
        });
        return;
    }

    const newNickname = message.content.trim();
    const validation = validateNickname(newNickname);
    if (!validation.valid) {
        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.colors.warning)
                    .setDescription(`Nickname not valid: ${validation.reason}`)
            ]
        });
        return;
    }

    const oldNick = message.member.nickname;
    try {
        await message.member.setNickname(newNickname);
        await message.react(botConfig.get('reactionEmoji') || config.reactionEmoji);
        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setDescription(`>>> Nickname changed to **${newNickname}**`)
            ]
        });
        await logNicknameChange(message.guild, message.author, oldNick, newNickname);
        const logs = botLogs.get('nicknames') || [];
        logs.push({ user: message.author.tag, oldNick, newNick: newNickname, time: Date.now() });
        botLogs.set('nicknames', logs);
    } catch (error) {
        console.error('[Nickname Change] :: Something went wrong...'.red,error);
        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('Failed to change nickname. (Missing permissions or role hierarchy?)')
            ]
        });
    }
});

client.login(process.env.TOKEN)