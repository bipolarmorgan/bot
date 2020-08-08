const BaseEvent = require('../../classes/WebSocketEvent');

class tagDelete extends BaseEvent {
    constructor() {
        super('tagDelete');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{ guild_id:string, name:string }} payload
     */
    run(client, payload) {
        if (!client.db.tags.cache.has(payload.guild_id)) return;
        const tags = client.db.tags.cache.get(payload.guild_id);
        if (tags.has(payload.name)) tags.delete(payload.name);
        client.db.tags.cache.set(payload.guild_id, tags);
    }
}

module.exports = tagDelete;