import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class balance extends Command {
    constructor() {
        super({
            config: {
                name: 'balance',
                description: 'Shows User Balance',
                permission: 'User',
            },
            options: {
                aliases: ['bal'],
                clientPermissions: [],
                premiumServer: false,
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: 'balance [User]',
                donatorOnly: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        let target = await client.resolveUser(args[0]) || message.author;
        if (!target) target = message.author;
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Error: Cannot show balance of a bot user.'));
        }
        const user = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
            .setDescription(`**${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** 💸`)
        );
    }
}