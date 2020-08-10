const BaseEvent = require('../../classes/DiscordEvent');
const { Poster } = require('dbots');
const { APIKeys }  = require('../../utils/Constants');
module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     */
    async run(client) {
        const poster = new Poster({
            apiKeys: APIKeys,
            client,
            clientID: client.user.id,
            clientLibrary: 'discord.js'
        });
        poster.startInterval();
    }
}