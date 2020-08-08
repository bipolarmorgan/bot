const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'divorce',
                description: 'File a divorce to your husband/wife',
                permission: 'User',
            },
            options: {
                aliases: ['breakup'],
                cooldown: 1200,
                nsfwCommand: false,
                args: false,
                usage: 'divorce',
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
    async run(client, message, _args, _g, userStats) {
        const id = userStats.marriage_id;
        if (!id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription(`You can't file a divorce when you are not married to someone ;p`)
            );
        }
        const waifu = await client.db.users.fetch(id).catch((e) => { throw e; });
        userStats.marriage_id = '';
        waifu.marriage_id = '';
        await userStats.save().catch((e) => { throw e; });
        await waifu.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor(0x00FFFF)
            .setTimestamp()
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
            .setDescription(`${message.author} and <@${waifu.id}> has gotten a divorce :<`)
        );
    }
}