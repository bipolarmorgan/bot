import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Poll extends Command {
    constructor() {
        super({
            config: {
                name: 'poll',
                description: 'Make polls using this command!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['ADD_REACTIONS'],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'poll <Poll>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        try {
            await message.react(await client.getEmoji('yes'));
            await message.react(await client.getEmoji('no'));
            await message.react(await client.getEmoji('PepoShrug'));
        } catch (e) {
            client.logger.warn(`Reactions did not react on ${message.guild.name} / ${message.guild.id} / ${message.id}`);
            return false;
        }
    }
}