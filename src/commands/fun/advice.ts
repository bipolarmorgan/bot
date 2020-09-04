import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Advice extends Command {
    constructor() {
        super({
            config: {
                name: 'advice',
                description: 'Sends a Random life advice!',
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
            const response = await fetch(`https://api.adviceslip.com/advice`);
            const body = await response.json();
            message.channel.send(body.slip.advice);
        } catch (e) {
            throw e;
        }
    }
}