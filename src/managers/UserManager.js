const BaseManager = require('../classes/BaseManager');

class UserManager extends BaseManager {
    constructor(client) {
        super(client);
        /**
         * @type {import('discord.js').Collection<string, import('../classes/User')>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/User')>}
     * @param {string} user_id
     */
    fetch(user_id) {
        return new Promise(async (resolve, reject) => {
            if (this.cache.has(user_id)) return resolve(this.cache.get(user_id));
            await this.client.server.get(`/api/user/${user_id}`).catch(reject);
            process.nextTick(() => resolve(this.cache.get(user_id)));
        });
    }
    /**
     * @returns {Promise<void>}
     * @param {string} user_id
     */
    delete(user_id) {
        return new Promise(async (resolve, reject) => {
            await this.client.server.delete(`/api/user/${user_id}`).catch(reject);
            resolve();
        });
    }
}

module.exports = UserManager;