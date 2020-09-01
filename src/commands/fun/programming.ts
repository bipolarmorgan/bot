import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Programming extends Command {
    constructor() {
        super({
            config: {
                name: 'programming',
                description: 'Random programming quote!',
                permission: 'User',
            },
            options: {
                aliases: ['pquote'],
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
            const quote = await fetch('https://programming-quotes-api.herokuapp.com/quotes/random').then((r) => r.json());
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`${quote.en}`)
                .setFooter(`- ${quote.author}`)
            );
        } catch (e) {
            throw e;
        }
    }
}