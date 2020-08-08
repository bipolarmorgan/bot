const fetch = require('node-fetch');
const { BotLists } = require('../utils/Constants');

module.exports = class POSTManager {
    /**
     * 
     * @param {import('discord.js').ShardingManager} manager
     */
    constructor(manager) {
        this.manager = manager;
    }
    /**
     * @returns {Promise<Object<string, number>>}
     */
    async getStats() {
        return {
            server_count: await this.getCount('guilds'),
            member_count: await this.getCount('users'),
            shard_count: this.manager.shards.size,
        }
    }
    /**
     * @returns {Promise<number>}
     * @param {"users"|"guilds"} props 
     */
    async getCount(props) {
        if (props === 'users') {
            const raw = await this.manager.broadcastEval(`this.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0)`);
            return raw.reduce((acc, cur) => acc + cur, 0);
        } else if (props === 'guilds') {
            const raw = await this.manager.broadcastEval(`this.guilds.cache.size`);
            return raw.reduce((acc, cur) => acc + cur, 0);
        } return 0;
    }
    startInterval() {
        const services = Object.keys(BotLists);
        setInterval(async () => {
            const { server_count, member_count, shard_count } = await this.getStats();
            for (let service of services) {
                service = BotLists[service];
                await this.post({ service, server_count, shard_count, member_count });
            }
        }, 60000 * 31);
    }
    /**
     * @private
     * @param {Object} options 
     * @param {Object} options.service
     * @param {string} options.service.token
     * @param {string} options.service.endpoint
     * @param {Function} options.service.parse
     * @param {number} options.server_count
     * @param {number} options.shard_count
     * @param {number} options.member_count
     */
    async post(options) {
        if (!options.service.token) return;
        try {
            await fetch.default(options.service.endpoint.replace(/:id/g, this.server.id), {
                method: 'POST',
                headers: {
                    Authorization: options.service.token,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(options.service.parse(options.server_count, options.shard_count, options.member_count)),
            }).catch(() => { });
        } catch (e) { }
    }
}