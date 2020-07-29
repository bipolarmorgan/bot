const BaseEvent = require('../classes/BaseEvent');
module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    }
    /**
     * 
     * @param {import('../classes/Unicron')} client 
     */
    async run(client) {
        client.forceSweep(70);
        client.startSweepInterval();
    }
}