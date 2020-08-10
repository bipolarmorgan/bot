const BaseEvent = require('../../classes/WebSocketEvent');

class ErrorEvent extends BaseEvent {
    constructor() {
        super('disconnect');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     */
    run(client) {
        client.logger.warn(`[NOTICE] Database Connection Disconnected`);

    }
}

module.exports = ErrorEvent;