const BaseEvent = require('../../classes/WebSocketEvent');

class ErrorEvent extends BaseEvent {
    constructor() {
        super('error');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {*} err 
     */
    run(client, err) {
        client.logger.error(err);
    }
}

module.exports = ErrorEvent;