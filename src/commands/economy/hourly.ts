import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Hourly extends Command {
    constructor() {
        super({
            config: {
                name: 'hourly',
                description: 'Get paid per hour using this command!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3600,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, _args: string[], _g: Guild, userStats: User) {
        const prize = client.utils.Random.nextInt({ max: 700, min: 500 });
        userStats.balance += prize;
        await userStats.save().catch((e) => { throw e; });
        message.channel.send(`You have gotten **${prize}** coins!`);
    }
}