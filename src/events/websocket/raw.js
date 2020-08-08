const BaseEvent = require('../../classes/WebSocketEvent');

class Raw extends BaseEvent {
    constructor() {
        super('raw');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {string} eventName 
     * @param {{any}} payload 
     */
    async run(client, eventName, payload) {
        client.server.emit(eventName, payload);
    }
}

module.exports = Raw;