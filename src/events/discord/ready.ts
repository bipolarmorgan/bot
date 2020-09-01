// import { Poster } from 'dbots';
import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';

export default class Ready extends DiscordEvent {
    private status: ((client: Client) => Promise<void>)[];
    constructor() {
        super('ready');
        this.status = [
            async (client: Client) => {
                await client.user.setPresence({
                    activity: {
                        name: `${await client.getCount('guilds')} guilds!`,
                        type: 'LISTENING',
                    },
                    status: 'online',
                });
            },
            async (client: Client) => {
                await client.user.setPresence({
                    activity: {
                        name: `${await client.getCount('users')} users!`,
                        type: 'WATCHING',
                    },
                    status: 'online',
                });
            },
            async (client: Client) => {
                await client.user.setPresence({
                    activity: {
                        name: `unicron-bot.xyz`,
                        type: 'PLAYING',
                    },
                    status: 'online',
                });
            },
            async (client: Client) => {
                await client.user.setPresence({
                    activity: {
                        name: `to Discord`,
                        type: 'STREAMING',
                    },
                    status: 'online',
                });
            },
            async (client: Client) => {
                await client.user.setPresence({
                    activity: {
                        name: `-help`,
                        type: 'PLAYING',
                    },
                    status: 'online',
                });
            },
            async (client: Client) => {
                await client.user.setPresence({
                    activity: {
                        name: `DMs`,
                        type: 'LISTENING',
                    },
                    status: 'online',
                });
            },
            async (client: Client) => {
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
    async run(client: Client) {
        // const poster = new Poster({
        //     apiKeys: {
        //         glennbotlist: process.env.GLENN_TOKEN || null,
        //         arcane: process.env.ARCANE_TOKEN || null,
        //         mythicalbots: process.env.MYTHICAL_TOKEN || null,
        //         listmybots: process.env.LMB_TOKEN || null,
        //         discordboats: process.env.BOAT_TOKEN || null,
        //         botsfordiscord: process.env.BFD_TOKEN || null,
        //         topgg: process.env.TOPGG_TOKEN || null,
        //         botsondiscord: process.env.BOD_TOKEN || null,
        //         discordbotsgg: process.env.DBG_TOKEN || null,
        //         discordbotlist: process.env.DBL_TOKEN || null,
        //     },
        //     client,
        //     clientID: client.user.id,
        //     clientLibrary: 'discord.js',
        //     shard: client.shard,
        // });
        // poster.startInterval();
        client.setInterval(async () => {
            await this.status[Math.floor(Math.random() * this.status.length)](client).catch(() => { });
        }, 60000 * 6);
    }
}