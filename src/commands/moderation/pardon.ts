import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';

export default class Pardon extends Command {
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
    async run(client: Client, message: Message, args: string[], settings: Guild) {
        const [user_id, ...reason] = args;
        try {
            const member = await message.guild.fetchBan(user_id);
            try {
                const user = await message.guild.members.unban(member.user.id, reason.length ? reason.join(' ') : 'No reason provided');
                const modChannel: any = message.guild.channels.cache.get(settings.modLogChannel);
                if (modChannel && modChannel.type === 'text') {
                    await modChannel.send(new MessageEmbed()
                        .setColor('RANDOM')
                        .setTimestamp()
                        .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`**Member** : ${user.tag} / ${user.id}\n**Action** : Pardon/Unban\n**Reason** : ${reason.length ? reason.join(' ') : 'No reason provided'}`)
                    ).catch(() => { });
                }
                message.channel.send('User was pardoned!');
            } catch (e) {
                return message.channel.send('Sorry, i couldnt unban that user.');
            }
        } catch (e) {
            message.channel.send('That user is not banned from this server or its an Unknown Ban');
        }
    }
}