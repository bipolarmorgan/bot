import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Marriage extends Command {
    constructor() {
        super({
            config: {
                name: 'marriage',
                description: 'Shows marriage certificate of a user',
                permission: 'User',
            },
            options: {
                aliases: ['waifu'],
                cooldown: 3,
                clientPermissions: [],
                nsfwCommand: false,
                args: false,
                usage: 'marriage [User]',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        const t = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        if (!t.marriage_id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
                .setDescription('Not married to someone else, kek')
            );
        }
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
            .setTitle('Marriage Certificate')
            .setDescription(`<@${target.id}> ❤️ <@${t.marriage_id}>`)
        );
    }
}