import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class ROT13 extends Command {
    constructor() {
        super({
            config: {
                name: 'rot13',
                description: 'Encodes your given text to ROT13 Cipher!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'rot13 <...Text>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(
            args.join(' ').replace(/[A-Za-z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + (c.toUpperCase() <= 'M' ? 13 : -13))).replace(/@/g, '@' + String.fromCharCode(8203))
        );
    }
}