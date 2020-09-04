import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class BadQuotes extends Command {
    constructor() {
        super({
            config: {
                name: 'badquotes',
                description: 'Sends a Random bad quote!',
                permission: 'User',
            },
            options: {
                aliases: ['badquote'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        try {
            const response = await fetch(`https://breaking-bad-quotes.herokuapp.com/v1/quotes`);
            const body = await response.json();
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`${body[0]['quote']}`)
                .setFooter(`- ${body[0]['author']}`)
            );
        } catch (e) {
            throw e;
        }
    }
}