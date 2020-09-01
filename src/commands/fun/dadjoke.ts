import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Dadjoke extends Command {
    constructor() {
        super({
            config: {
                name: 'dadjoke',
                description: 'Sends a Random dad joke!',
                permission: 'User',
            },
            options: {
                aliases: ['dad'],
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
            const response = await fetch(`https://icanhazdadjoke.com/`, {
                headers: {
                    Accept: 'application/json'
                }
            });
            const body = await response.json();
            return message.channel.send(body.joke);
        } catch (e) {
            throw e;
        }
    }
}