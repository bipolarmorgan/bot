import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class MD5 extends Command {
    constructor() {
        super({
            config: {
                name: 'md5',
                description: 'MD5 Hash Encryption.',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'md5 <...Text>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(client.hash(args.join(' '), 'md5'));
    }
}