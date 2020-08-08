const BaseEvent = require('../../classes/WebSocketEvent');

class userDelete extends BaseEvent {
    constructor() {
        super('userUpdate');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {string} payload_id
     */
    run(client, payload_id) {
        if (client.db.users.cache.has(payload_id)) client.db.users.cache.delete(payload_id);
    }
}

module.exports = userDelete;