module.exports = {
    token: process.env.TOKEN || '', // your bot token
    channelId: process.env.CHANNEL_ID || '', // channel id
    reactionEmoji: process.env.REACTION_EMOJI || '✅', // reaction emoji
    
    status: process.env.STATUS || 'online', // idle, dnd, online, invisible
    activityName: process.env.ACTIVITY_NAME || 'Hello World', // name of the activity
    activityType: process.env.ACTIVITY_TYPE || 'Custom', // Custom, Playing, Streaming, Listening, Watching

    colors: {
        success: 0x57F287, // green (success)
        error: 0xED4245, // red (error)
        warning: 0xFEE75C, // yellow (warning)
    },
    
    nickname_role_require: {
        enabled: false, // set to true to require a specific role
        role_ids: [] // set allowed role IDs here (array)
    }
}; 