import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class SHA512 extends Command {
    constructor() {
        super({
            config: {
                name: 'sha512',
                description: 'sha512 Hash Encryption.',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'sha512 <...Text>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(client.hash(args.join(' '), 'sha512'));
    }
}