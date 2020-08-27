const BaseEvent = require('../../classes/DiscordEvent');
const { Poster } = require('dbots');
module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     */
    async run(client) {
        const poster = new Poster({
            apiKeys: {
                glennbotlist: process.env.GLENN_TOKEN || null,
                arcane: process.env.ARCANE_TOKEN || null,
                mythicalbots: process.env.MYTHICAL_TOKEN || null,
                listmybots: process.env.LMB_TOKEN || null,
                discordboats: process.env.BOAT_TOKEN || null,
                botsfordiscord: process.env.BFD_TOKEN || null,
                topgg: process.env.TOPGG_TOKEN || null,
                botsondiscord: process.env.BOD_TOKEN || null,
                discordbotsgg: process.env.DBG_TOKEN || null,
                discordbotlist: process.env.DBL_TOKEN || null,
            },
            client,
            clientID: client.user.id,
            clientLibrary: 'discord.js'
        });
        poster.startInterval();
    }
}