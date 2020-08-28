const BaseEvent = require('../../classes/DiscordEvent');
const { Poster } = require('dbots');
module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
        this.status = [
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `${await client.getCount('guilds')} guilds!`,
                        type: 'LISTENING',
                    },
                    status: 'online',
                });
            },
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `${await client.getCount('users')} users!`,
                        type: 'WATCHING',
                    },
                    status: 'online',
                });
            },
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `unicron-bot.xyz`,
                        type: 'PLAYING',
                    },
                    status: 'online',
                });
            },
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `to Discord`,
                        type: 'STREAMING',
                    },
                    status: 'online',
                });
            },
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `-help`,
                        type: 'PLAYING',
                    },
                    status: 'online',
                });
            },
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `DMs`,
                        type: 'LISTENING',
                    },
                    status: 'online',
                });
            },
            /**
             * 
             * @param {import('../../classes/Unicron')} client 
             */
            async (client) => {
                await client.user.setPresence({
                    activity: {
                        name: `DM me for help!`,
                        type: 'PLAYING',
                    },
                    status: 'online',
                });
            },
        ]
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
        client.setInterval(async () => {
            await this.status[Math.floor(Math.random() * this.status.length)](client).catch(() => { });
        }, 60000 * 6);
    }
}