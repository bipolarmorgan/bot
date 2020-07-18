const Server = require('../api/classes/Server');
const fetch = require('node-fetch');
const { BotLists } = require('../utils/Constants');

module.exports = class POSTManager {
    /**
     * 
     * @param {Server} server
     * @param {Object<string, any>} options 
     */
    constructor(server) {
        this.server = server;
    }
    /**
     * @returns {Promise<Object<string, number>>}
     */
    async getStats() {
        return {
            server_count: await this.server.getCount('guilds'),
            member_count: await this.server.getCount('users'),
            shard_count: this.server.manager.shards.size,
        }
    }

    async startInterval() {
        const services = Object.keys(BotLists);
        for (let service of services) {
            service = BotLists[service];
            const { server_count, member_count, shard_count } = await this.getStats();
            await this.post({ service, server_count, shard_count, member_count });
        }
        setInterval(async () => {
            for (let service of services) {
                service = BotLists[service];
                const { server_count, member_count, shard_count } = await this.getStats();
                await this.post({ service, server_count, shard_count, member_count });
            }
            const count = await this.server.manager.broadcastEval(`this.users.cache.sweep(() => Math.random() < .65)`).catch(() => { });
            this.server.logger.info(`${count.reduce((acc, cur) => acc + cur, 0)} users sweeped!`);
        }, 60000 * 30);
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
        if (!options.service || !options.service.token) return;
        try {
            const url = options.service.endpoint.replace(/:id/g, this.server.id);
            await fetch.default(url, {
                method: 'POST',
                headers: {
                    Authorization: options.service.token,
                    'Content-type': 'application/json',
                    'User-Agent': 'Unicron LLC'
                },
                body: JSON.stringify(options.service.parse(options.server_count, options.shard_count, options.member_count)),
            }).catch(() => { });
        } catch (e) { }
    }
}