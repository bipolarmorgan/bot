const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes//BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'pardon',
                description: 'Pardon/unban someone from the server!',
                permission: 'Server Moderator',
            },
            options: {
                aliases: [],
                clientPermissions: ['BAN_MEMBERS'],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'pardon <UserID> [...Reason]',
                donatorOnly: false,
                premiumServer: false,
            },
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     * @param {import('../../classes/Guild')} settings
     */
    async run(client, message, args, settings) {
        const [user_id, ...reason] = args;
        try {
            const member = await message.guild.fetchBan(user_id);
            try {
                const user = await message.guild.members.unban(member.user.id, reason ? reason.join(' ') : 'No reason provided');
                const modChannel = await client.channels.fetch(settings.modLogChannel).catch(() => { });
                if (modChannel) {
                    modChannel.send(new MessageEmbed()
                        .setColor('RANDOM')
                        .setTimestamp()
                        .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }) || message.guild.iconURL())
                        .setDescription(`**Member** : ${user.tag} / ${user.id}\n**Action** : Pardon/Unban\n**Reason** : ${reason ? reason.join(' ') : 'No reason provided'}`)
                    ).catch(() => { });
                }
                message.channel.send('User was pardoned!');
            }
            catch (e) {
                return message.channel.send('Sorry, i couldnt unban that user.');
            }
        }
        catch (e) {
            message.channel.send('That user is not banned from this server or its an Unknown Ban');
        }
    }
}