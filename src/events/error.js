
const BaseEvent = require('../classes/BaseEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('error');
    }
    /**
     * 
     * @param {import('../classes/Unicron')} client 
     */
    async run(client, error) {
        client.logger.error(`An error event was sent by Discord.js: \n${error.name}`);
    }
}