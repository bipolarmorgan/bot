import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import quotes from '../../assets/quotes';

export default class Qoute extends Command {
    constructor() {
        super({
            config: {
                name: 'quote',
                category: 'fun',
                description: 'Shows a random quote to get you inspired.',
                permission: 'User',
            },
            options: {
                aliases: ['quotes'],
                cooldown: 10,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        const index = quotes[Math.floor(Math.random() * quotes.length)]
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${index.quote}`)
            .setFooter(`- ${index.author}`)
        );
    }
}