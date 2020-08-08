const BaseEvent = require('../../classes/DiscordEvent');
module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     */
    async run(client) {
        
    }
}