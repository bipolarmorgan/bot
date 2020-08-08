const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('guildDelete');
    }
    /**
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').Guild} guild
     */
    async run(client, guild) {
        const channel = await client.channels.fetch(client.unicron.channel, false);
        channel.send(`Unicron left \`${guild.name}\``);
        client.shard.broadcastEval(`
            this.user.setPresence({
                activity: {
                    name: \`${await client.getCount('guilds')} guilds! | ?help\`,
                    type: 'LISTENING',
                },
                status: 'online',
            });
        `);
        client.db.guilds.delete(guild.id).catch(console.log);
    }
}