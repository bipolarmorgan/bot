import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Reverse extends Command {
    constructor() {
        super({
            config: {
                name: 'reverse',
                description: 'Reverses the given text.',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'reverse <...Text>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        message.channel.send(client.shorten(args
            .join(' ')
            .split('')
            .reverse()
            .join('')
            .replace(/@/g, '@' + String.fromCharCode(8203))
            , 2040)
        );
    }
}