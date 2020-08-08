const { Collection } = require('discord.js');

class BaseManager {
    /**
     * 
     * @param {import('./Unicron')} client
     */
    constructor(client) {
        this.client = client;
        this.cache = new Collection();
    }
}

module.exports = BaseManager