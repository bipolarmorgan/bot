const BaseManager = require('../classes/BaseManager');
const { Collection } = require('discord.js');
const Tag = require('../classes/Tag');

class TagManager extends BaseManager {
    constructor(client) {
        super(client);
        /**
         * @type {import('discord.js').Collection<string, import('discord.js').Collection<string, import('../classes/Tag')>>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/Tag')>}
     * @param {string} guild_id
     * @param {string} tag_name
     */
    fetch(guild_id, tag_name) {
        if (!this.client.db.tags.cache.has(guild_id)) this.client.db.tags.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            await this.client.server.get(`/api/tag/${guild_id}/${tag_name}`).catch(reject);
            resolve(this.client.db.tags.cache.get(guild_id).get(tag_name));
        });
    }
    /**
     * @returns {Promise<Collection<string, import('../classes/Tag')>}
     * @param {string} guild_id
     */
    fetchAll(guild_id) {
        if (!this.client.db.tags.cache.has(guild_id)) this.client.db.tags.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            /**
             * @type {[{guild_id:string, tag: { name:string, data: {}}}]}
             */
            const rawTags = await this.client.server.get(`/api/tags/${guild_id}`).catch(reject);
            const tags = this.client.db.tags.cache.get(guild_id);
            rawTags.forEach((t) => {
                tags.set(t.tag.name, new Tag(this.client, t));
            });
            resolve(tags);
        });
    }
}

module.exports = TagManager;