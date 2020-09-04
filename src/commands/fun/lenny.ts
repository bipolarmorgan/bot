import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Lenny extends Command {
    constructor() {
        super({
            config: {
                name: 'lenny',
                description: 'Sends a lenny face',
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
        message.channel.send('( ͡° ͜ʖ ͡°)');
    }
}