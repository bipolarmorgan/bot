const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'marry',
                description: 'Marry someone using this command. O.o <3',
                permission: 'User',
            },
            options: {
                aliases: ['merry'],
                cooldown: 1200,
                nsfwCommand: false,
                args: true,
                usage: 'marry [User]',
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
     * @param {import('../../classes/User')} userStats
     */
    async run(client, message, args, g, userStats) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You gotta mention who to marry -_-')
            );
        }
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You can\'t marry a bot user :P')
            );
        }
        if (message.author.equals(target)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You can\'t marry yourself :P')
            );
        }
        const ttarget = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        const tID = ttarget.marriage_id;
        const mID = userStats.marriage_id;
        if (tID === message.author.id) {
            return message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Woah, you two are already married.. <3')
            );
        }
        if (tID) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, but that person is already married to someone else -,-')
            );
        }
        if (mID) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Woah, you are already married to someone else -.-')
            );
        }
        const filter = function (response) {
            return response.author.id === target.id && ['yes'].includes(response.content.toLowerCase());
        };
        message.channel.send(`Hey ${target} will you accept ${message.author} as your beloved husband/wife? yes or no`);
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(async () => {
                userStats.married_id = target.id;
                ttarget.married_id = message.author.id;
                await userStats.save().catch((e) => { throw e; });
                await ttarget.save().catch((e) => { throw e; });
                return message.channel.send(`🎉 ${message.author} and ${target} has been married yay!. 🎉`);
            }).catch(() => {
                message.channel.send('Looks like nobody is getting married today.');
            });
    }
}