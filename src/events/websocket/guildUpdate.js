const BaseEvent = require('../../classes/WebSocketEvent');

const Guild = require('../../classes/Guild');

class guildUpdate extends BaseEvent {
    constructor() {
        super('guildUpdate');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{}} payload
     */
    run(client, payload) {
        client.db.guilds.cache.set(payload.id, new Guild(client, payload));
    }
}

module.exports = guildUpdate;