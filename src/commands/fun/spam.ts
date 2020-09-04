import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import path from 'path';

export default class Spam extends Command {
    constructor() {
        super({
            config: {
                name: 'spam',
                description: 'Shows image of the SPAM brand',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['ATTACH_FILES'],
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
        message.channel.send({ files: [path.join(__dirname, '..', '..', '..', 'assets', 'spam.png')] })
    }
}