const BaseEvent = require('../../classes/WebSocketEvent');

class guildDelete extends BaseEvent {
    constructor() {
        super('guildDelete');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {string} payload_id
     */
    run(client, payload_id) {
        if (client.db.guilds.cache.has(payload_id)) client.db.guilds.cache.delete(payload_id);
        if (client.db.members.cache.has(payload_id)) client.db.members.cache.delete(payload_id);
    }
}

module.exports = guildDelete;