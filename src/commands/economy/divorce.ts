import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Divorce extends Command {
    constructor() {
        super({
            config: {
                name: 'divorce',
                description: 'File a divorce to your husband/wife',
                permission: 'User',
            },
            options: {
                aliases: ['breakup'],
                clientPermissions: [],
                cooldown: 1200,
                nsfwCommand: false,
                args: false,
                usage: 'divorce',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, _args: string[], _g: Guild, userStats: User) {
        const id = userStats.marriage_id;
        if (!id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
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
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${message.author} and <@${waifu.id}> has gotten a divorce :<`)
        );
    }
}