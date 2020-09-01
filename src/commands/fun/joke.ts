import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import joke from 'one-liner-joke';

export default class Joke extends Command {
    constructor() {
        super({
            config: {
                name: 'joke',
                description: 'Get a random joke!',
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
        message.channel.send(joke.getRandomJoke().body);
    }
}