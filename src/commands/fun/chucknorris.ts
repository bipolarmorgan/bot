import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class ChuckNorris extends Command {
    constructor() {
        super({
            config: {
                name: 'chucknorris',
                description: 'Sends a Random Chuck Norris joke!',
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
            const response = await fetch(`https://api.chucknorris.io/jokes/random`);
            const body = await response.json();
            message.channel.send(body.value);
        } catch (e) {
            throw e;
        }
    }
}