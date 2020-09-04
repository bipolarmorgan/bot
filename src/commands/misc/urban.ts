import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Urban extends Command {
    constructor() {
        super({
            config: {
                name: 'urban',
                description: 'Urban Dictionary 101',
                permission: 'User',
            },
            options: {
                aliases: ['dict', 'urban-dict'],
                cooldown: 12,
                args: true,
                nsfwCommand: true,
                usage: 'urban <Word>',
                donatorOnly: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        const query = `?term=${encodeURIComponent(args.join(' '))}`;
        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then((response) => response.json());
        if (!list.length) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription(`No results found for **${args.join(' ')}**.`));
        }
        const [answer] = list;
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addField('Definition', client.shorten(answer.definition, 1024), false)
            .addField('Example', client.shorten(answer.example, 1024), false)
            .setFooter(`Rating: ${answer.thumbs_up - answer.thumbs_down} Upvotes.`)
        );
    }
}