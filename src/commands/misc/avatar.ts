import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Avatar extends Command {
    constructor() {
        super({
            config: {
                name: 'avatar',
                description: 'Check user avatar',
                permission: 'User',
            },
            options: {
                aliases: ['av'],
                cooldown: 3,
                args: false,
                usage: `avatar [User]`,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(target.tag, target.avatarURL({ dynamic: true }))
            .setImage(target.displayAvatarURL({ dynamic: true }))
        );
    }
}