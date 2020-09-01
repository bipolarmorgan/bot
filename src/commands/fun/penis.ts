import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Penis extends Command {
    constructor() {
        super({
            config: {
                name: 'penis',
                description: 'User Penis length identifier 5000',
                permission: 'User',
            },
            options: {
                cooldown: 12,
                args: false,
                usage: 'penis [UserMention|UserID]',
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${target.tag}\'s penis`);
        let max = client.utils.Random.nextInt({ max: 30, min: 0 });
        let gland = '';
        for (let i = 0; i < max; i++) {
            gland += '=';
        }
        embed.setDescription(`8${gland}D`);
        return message.channel.send(embed);
    }
}