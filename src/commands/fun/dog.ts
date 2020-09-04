import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Dog extends Command {
    constructor() {
        super({
            config: {
                name: 'dog',
                description: 'Random Dogs',
                permission: 'User',
            },
            options: {
                aliases: [],
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
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const { message: attachment } = await response.json();
            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription('https://dog.ceo/')
                .setImage(attachment)
            );
        } catch (e) {
            throw e;
        }
    }
}