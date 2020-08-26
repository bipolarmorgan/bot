const Event = require('../../classes/DiscordEvent');

const inviteFilter = require('../../filters/inviteFilter');
const mentionSpamFilter = require('../../filters/mentionSpamFilter');
const swearFilter = require('../../filters/swearFilter');
const memberVerification = require('../../modules/Verification');

module.exports = class extends Event {
    constructor() {
        super('messageUpdate');
    }
    /**
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} oldMessage 
     * @param {import('discord.js').Message} message
     */
    async run(client, oldMessage, message) {
        if (newMessage.partial) await newMessage.fetch().catch(() => { });
        if (!newMessage) return;
        const guildSettings = await client.db.guilds.fetch(message.guild.id).catch(console.log);
        message.author.permLevel = client.permission.level(message);
        if (await memberVerification(client, message, guildSettings)) return;
        if (await swearFilter(client, message, guildSettings)) return;
        if (await inviteFilter(client, message, guildSettings)) return;
        if (await mentionSpamFilter(client, message, guildSettings)) return;
    }
}