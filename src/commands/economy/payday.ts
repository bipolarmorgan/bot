import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Payday extends Command {
    constructor() {
        super({
            config: {
                name: 'payday',
                description: 'ITS PAYDAY',
                permission: 'User',
            },
            options: {
                aliases: ['daily'],
                clientPermissions: [],
                cooldown: 60 * 60 * 24,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, _args: string[], _g: Guild, userStats: User) {
        const prize = client.utils.Random.nextInt({ max: 1500, min: 1000 });
        userStats.balance += prize;
        await userStats.save().catch((e) => { throw e; });
        message.channel.send(`You have received **${prize}** coins!`);
    }
}