import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Duck extends Command {
    constructor() {
        super({
            config: {
                name: 'duck',
                description: 'Random pictures of a duck!',
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
            const response = await fetch('https://random-d.uk/api/v1/random');
            const { url: attachment } = await response.json();
            message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription('https://random-d.uk/')
                .setImage(attachment)
            );
        } catch (e) {
            throw e;
        }
    }
}