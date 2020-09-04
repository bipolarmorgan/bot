import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Trump extends Command {
    constructor() {
        super({
            config: {
                name: 'trump',
                description: 'Sends a random stupid thing that Donald Trump ever said!',
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
            const response = await fetch(`https://www.tronalddump.io/random/quote`);
            const body = await response.json();
            message.channel.send(body.value);
        } catch (e) {
            throw e;
        }
    }
}