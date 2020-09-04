import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import path from 'path';

export default class Nitro extends Command {
    constructor() {
        super({
            config: {
                name: 'nitro',
                description: 'Fake Nitro giveaway',
                permission: 'User',
            },
            options: {
                aliases: ['fakenitro', 'fake-nitro'],
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
        message.channel.send(`htt${String.fromCharCode(8203)}ps://discord.${String.fromCharCode(8203)}gift/${client.utils.Random.string(16)}`, { files: [path.join(__dirname, '..', '..', '..', 'assets', 'nitro.png')] });
    }
}