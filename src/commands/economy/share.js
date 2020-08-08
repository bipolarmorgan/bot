const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'share',
                description: 'Share coins to a user!',
                permission: 'User',
            },
            options: {
                aliases: ['transfer', 'give', 'pay'],
                cooldown: 180,
                nsfwCommand: false,
                args: true,
                usage: 'share <Amount> <User>\nshare <User> <Amount>',
                donatorOnly: false,
            }
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     * @param {import('../../classes/User')} userStats
     */
    async run(client, message, args, _g, userStats) {
        const currentAmount = userStats.balance;
        const target = await client.resolveUser(args[0]) || await client.resolveUser(args[1]);
        let transferAmount = await client.resolveUser(args[0]) ? args[1] : args[0];
        if (isNaN(transferAmount)) {
            if (transferAmount === 'all') { transferAmount = currentAmount; }
            else if (transferAmount === 'half') { transferAmount = Math.floor(currentAmount / 2); }
            else if (transferAmount === 'quarter') { transferAmount = Math.floor(currentAmount * .25); }
            else {
                return message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Sorry, that's an invalid amount`)
                );
            }
        }
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, cannot send coins to this bot user')
            );
        }
        if (!target) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription(`Sorry, that's an invalid user`)
            );
        }
        if (target.id === message.author.id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, uou cannot send coins to yourself, lmao`)
            );
        }
        if (transferAmount > currentAmount) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription(`Sorry, you don\'t have enough balance to send that amount of coins :P`)
            );
        }
        if (transferAmount < 100) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription('Sorry, please enter an amount greater than **100**')
            );
        }
        const transferTarget = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        userStats -= transferAmount;
        transferTarget.balance += transferAmount;
        await userStats.save().catch((e) => { throw e; });
        await transferTarget.save().catch((e) => { throw e; })
        message.channel.send(new MessageEmbed()
            .setColor(0x00FF00)
            .setAuthor(`Transaction ID: ${client.utils.Random.string(6)}`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(`Successfully transferred **${transferAmount}**💰 to ${target}.\nYour balance is now **${userStats.balance}**💰`)
        );
    }
}