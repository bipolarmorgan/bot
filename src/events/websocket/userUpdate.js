const BaseEvent = require('../../classes/WebSocketEvent');

const User = require('../../classes/User');

class userUpdate extends BaseEvent {
    constructor() {
        super('userUpdate');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{}} payload
     */
    run(client, payload) {
        client.db.users.cache.set(payload.id, new User(client, payload));
    }
}

module.exports = userUpdate;