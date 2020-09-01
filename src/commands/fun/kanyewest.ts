import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class KanyeWest extends Command {
    constructor() {
        super({
            config: {
                name: 'kanyewest',
                description: 'Sends a Random Kanye West quote!',
                permission: 'User',
            },
            options: {
                aliases: ['kanye'],
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
            const response = await fetch(`https://api.kanye.rest/`);
            const body = await response.json();
            message.channel.send(body.quote);
        } catch (e) {
            throw e;
        }
    }
}