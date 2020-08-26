const BaseManager = require('../classes/BaseManager');

class GuildManager extends BaseManager {
    constructor(client) {
        super(client);
        /**
         * @type {import('discord.js').Collection<string, import('../classes/Guild')>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/Guild')>}
     * @param {string} guild_id
     */
    fetch(guild_id) {
        return new Promise(async (resolve, reject) => {
            if (this.cache.has(guild_id)) return resolve(this.cache.get(guild_id));
            await this.client.server.get(`/api/guild/${guild_id}`).catch(reject);
            process.nextTick(() => resolve(this.cache.get(guild_id)));
        });
    }
    /**
     * @returns {Promise<void>}
     * @param {string} guild_id
     */
    delete(guild_id) {
        return new Promise(async (resolve, reject) => {
            await this.client.server.delete(`/api/guild/${guild_id}`).catch(reject);
            resolve();
        });
    }
}

module.exports = GuildManager;