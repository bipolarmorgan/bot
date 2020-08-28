const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');
const MINIMUM_COINS = 500;
const Offense = {
    car: 30,
    motorcycle: 25,
    pistol: 20,
    dagger: 15,
};
const Defense = {
    dog: 30,
    shield: 25,
    bow: 20,
    padlock: 15,
};
/**
 * 
 * @param {import('../../classes/User')} user 
 */
const getOffense = function (user) {
    let score = 0;
    if (user.hasItem('car')) score += Offense.car;
    if (user.hasItem('motorcycle')) score += Offense.motorcycle;
    if (user.hasItem('pistol')) score += Offense.pistol;
    if (user.hasItem('dagger')) score += Offense.dagger;
    return score;
};
/**
 * 
 * @param {import('../../classes/User')} user 
 */
const getDefense = function (user) {
    let score = 0;
    if (user.hasItem('dog')) score += Defense.dog;
    if (user.hasItem('shield')) score += Defense.shield;
    if (user.hasItem('bow')) score += Defense.bow;
    if (user.hasItem('padlock')) score += Defense.padlock;
    return score;
};

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'steal',
                description: 'Steal coins from an another user!',
                permission: 'User',
            },
            options: {
                aliases: ['rob'],
                clientPermissions: [],
                cooldown: 180,
                nsfwCommand: false,
                args: true,
                usage: 'steal <User>',
                donatorOnly: false,
                premiumServer: false,
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
    async run(client, message, args, g, userStats) {
        const utarget = await client.resolveUser(args[0]);
        if (!utarget || utarget.bot) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You need to mention a valid user to rob\n\`steal [UserMention|UserID|UserTag]\`')
            );
            return false;
        }
        if (message.author.equals(utarget)) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, you can\'t rob yourself, :P')
            );
            return false;
        }
        const target = await client.db.users.fetch(utarget.id).catch(console.log);
        const tbal = userStats.balance;
        const ubal = target.balance;
        if (tbal < MINIMUM_COINS) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, The victim must have atleast **${MINIMUM_COINS}** coins!`)
            );
            return false;
        }
        if (ubal < MINIMUM_COINS) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry, You must have atleast **${MINIMUM_COINS}** coins to steal from someone!`)
            );
            return false;
        }
        const attackPoints = getOffense(userStats);
        const defendPoints = getDefense(target);
        const chance = defendPoints - attackPoints;
        const bchance = 90 + chance;
        if (client.utils.Random.nextInt({ max: 200, min: 0 }) <= bchance) {
            const payout = Math.floor(
                tbal - (
                    tbal * (
                        client.utils.Random.nextInt({
                            max: client.utils.Random.nextInt({
                                max: 95,
                                min: 75,
                            }),
                            min: client.utils.Random.nextInt({
                                max: 74,
                                min: 50
                            })
                        }) * 0.01
                    )
                )
            );
            target.balance -= payout;
            userStats.balance += payout;
            await target.save().catch((e) => { throw e; });
            await userStats.save().catch((e) => { throw e; });
            return message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`You successfully robbed <@${utarget.id}> and your payout is **${payout}** coins!`)
            );
        }
        if (client.utils.Random.nextInt({ max: 100, min: 0 }) <= 15) {
            const lmao = Math.floor(
                ubal - (
                    ubal * (
                        client.utils.Random.nextInt({
                            max: client.utils.Random.nextInt({
                                max: 95,
                                min: 85,
                            }),
                            min: client.utils.Random.nextInt({
                                max: 84,
                                min: 75,
                            })
                        }) * 0.01
                    )
                )
            )
            userStats.balance -= lmao;
            userStats.save().catch((e) => { throw e; });
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`You got caught by the authorities and paid **${lmao}** coins to stay out of prison, OHHH.`)
            );
        }
        target.balance += MINIMUM_COINS;
        userStats.balance -= MINIMUM_COINS;
        await target.save().catch((e) => { throw e; });
        await userStats.save().catch((e) => { throw e; });
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`You got caught, and paid **${MINIMUM_COINS}** to the victim, OHHH`)
        );
    }
}