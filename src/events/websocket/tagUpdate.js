const BaseEvent = require('../../classes/WebSocketEvent');
const { Collection } = require('discord.js');
const Tag = require('../../classes/Tag');

class tagUpdate extends BaseEvent {
    constructor() {
        super('tagUpdate');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{}} payload
     */
    run(client, payload) {
        if (!client.db.tags.cache.has(payload.guild_id)) client.db.tags.cache.set(payload.guild_id, new Collection());
        const tags = client.db.tags.cache.get(payload.guild_id);
        tags.set(payload.tag.name, new Tag(client, payload));
        client.db.tags.cache.set(payload.guild_id, tags);
    }
}

module.exports = tagUpdate;