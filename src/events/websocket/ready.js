const BaseEvent = require('../../classes/WebSocketEvent');

class Ready extends BaseEvent {
    constructor() {
        super('ready');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {string} eventName 
     */
    run(client) {
        client.logger.info(`Database Connection Established!`);
    }
}

module.exports = Ready;