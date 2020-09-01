import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Fox extends Command {
    constructor() {
        super({
            config: {
                name: 'fox',
                description: 'Random pictures of a fox',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        const response = await fetch('https://randomfox.ca/floof/');
        const { image } = await response.json();
        message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('https://randomfox.ca/')
            .setImage(image)
        );
    }
}