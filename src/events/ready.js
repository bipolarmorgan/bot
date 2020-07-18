
const Client = require('../classes/Unicron');
const BaseEvent = require('../classes/BaseEvent');

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
        client.setInterval(() => {
            const c1 = client.users.cache.sweep(() => Math.random() < .90);
            client.logger.info(`${c1} users sweeped!`);
            const c2 = client.emojis.cache.sweep((e) => e.guild.id !== process.env.BOT_SERVER_ID && e.guild.id !== '603558917087428618');
            client.logger.info(`${c2} emojis sweeped!`);
        }, 60000 * 10);
    }
}