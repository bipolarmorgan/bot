const BaseEvent = require('../../classes/WebSocketEvent');

class Connecting extends BaseEvent {
    constructor() {
        super('connecting');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     */
    run(client) {
        client.logger.info(`Connecting to the Database Server...`);

    }
}

module.exports = Connecting;