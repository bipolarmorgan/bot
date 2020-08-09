const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'clearwarns',
                description: 'Clear warnings of a specific user!',
                permission: 'Server Moderator',
            },
            options: {
                aliases: ['clearwarnings'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'clearwarns <User>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
        const target = await client.resolveUser(args[0]);
        if (!target || target.bot) return message.channel.send(`I can't clear the warnings of an invalid user :/`);
        let member = await client.db.members.fetch(message.guild.id, target.id).catch(console.log);
        if (!member) member = await client.db.members.fetch(message.guild.id, target.id).catch(console.log);
        if (member.data && member.data.warnings) {
            member.data.warnings = [];
            await member.save().catch((e) => { throw e; });
            return message.channel.send(`${target}'s warnings cleared!`);
        }
        return message.channel.send(`${target}'s warnings was not cleared, because he/she doesn't have any warnings :P`);
    }
}