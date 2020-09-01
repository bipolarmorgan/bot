import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Cat extends Command {
    constructor() {
        super({
            config: {
                name: 'cat',
                description: 'Random Cat <3',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['EMBED_LINKS'],
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
            const response = await fetch('http://placekitten.com/200/300');
            const body = await response.json();
            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setImage(body)
                .setDescription('https://random.cat/')
            );
        } catch (e) {
            throw e;
        }
    }
}