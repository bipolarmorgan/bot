
const Client = require('../classes/Unicron');
const BaseEvent = require('../classes/BaseEvent');
const { Poster } = require('dbots');
const Constants = require('../utils/Constants');
module.exports = class extends BaseEvent {
    constructor() {
        super('ready');
    }
    /**
     * 
     * @param {Client} client 
     */
    async run(client) {
        await client.wait(5000);
        client.forceSweep(70);
        client.startSweepInterval();
        const poster = new Poster({
            client,
            clientID: '634908645896880128',
            clientLibrary: 'discord.js',
            apiKeys: Constants.APIKeys,
        });
        poster.startInterval();
    }
}