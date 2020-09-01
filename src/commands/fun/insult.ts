import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Insult extends Command {
    constructor() {
        super({
            config: {
                name: 'insult',
                description: 'Sends a Random insult!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: true,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        try {
            const response = await fetch(`https://evilinsult.com/generate_insult.php?lang=en&type=json`);
            const body = await response.json();
            message.channel.send(body.insult);
        } catch (e) {
            throw e;
        }
    }
}