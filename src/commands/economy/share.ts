import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Share extends Command {
    constructor() {
        super({
            config: {
                name: 'share',
                description: 'Share coins to a user!',
                permission: 'User',
            },
            options: {
                aliases: ['pay'],
                clientPermissions: [],
                premiumServer: false,
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'share <User> <Amount>',
                donatorOnly: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[], g: Guild, userStats: User) {
        const currentAmount = userStats.balance;
        const target = await client.resolveUser(args[0]);
        let transferAmount: string | number = args[1];
        if (isNaN(Number(transferAmount))) {
            if (transferAmount === 'all') { transferAmount = currentAmount; }
            else if (transferAmount === 'half') { transferAmount = Math.floor(currentAmount / 2); }
            else if (transferAmount === 'quarter') { transferAmount = Math.floor(currentAmount * .25); }
            else {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Sorry, that's an invalid amount`)
                );
            }
        }
        transferAmount = Number(transferAmount);
        if (!target) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, you cannot send coins to a invalid user\n\nUse \`${g.prefix}share <User> <Amount>\``)
            );
        }
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, you cannot send coins to a bot user\n\nUse \`${g.prefix}share <User> <Amount>\``)
            );
        }
        if (target.id === message.author.id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, you cannot send coins to yourself, lmao`)
            );
        }
        if (transferAmount > currentAmount) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, you don\'t have enough balance to send that amount of coins :P`)
            );
        }
        if (transferAmount < 100) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, please enter an amount greater than **100**')
            );
        }
        const transferTarget = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        userStats.balance -= transferAmount;
        transferTarget.balance += transferAmount;
        await userStats.save().catch((e) => { throw e; });
        await transferTarget.save().catch((e) => { throw e; })
        message.channel.send(new MessageEmbed()
            .setColor(0x00FF00)
            .setAuthor(`Transaction ID: ${client.utils.Random.string(12)}`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(`Successfully transferred **${transferAmount}**💰 to ${target}.\nYour balance is now **${userStats.balance}**💰`)
        );
    }
}