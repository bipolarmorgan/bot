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
    return new Promise(async (resolve, reject) => {
        let score = 0;
        if (await user.inventory.has('car')) score += Offense.car;
        if (await user.inventory.has('motorcycle')) score += Offense.motorcycle;
        if (await user.inventory.has('pistol')) score += Offense.pistol;
        if (await user.inventory.has('dagger')) score += Offense.dagger;
        return resolve(score);
    });
};
/**
 * 
 * @param {import('../../classes/User')} user 
 */
const getDefense = function (user) {
    return new Promise(async (resolve, reject) => {
        let score = 0;
        if (await user.inventory.has('dog')) score += Defense.dog;
        if (await user.inventory.has('shield')) score += Defense.shield;
        if (await user.inventory.has('bow')) score += Defense.bow;
        if (await user.inventory.has('padlock')) score += Defense.padlock;
        return resolve(score);
    });
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
     */
    async run(client, message, args) {
        const utarget = await client.resolveUser(args[0]);
        if (!utarget || utarget.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Sorry, You need to mention a valid user to rob\n\`steal [UserMention|UserID|UserTag]\`')
            );
        }
        if (message.author.equals(utarget)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription('Sorry, you can\'t rob yourself, :P')
            );
        }
        const target = await client.database.users.fetch(utarget.id);
        const tbal = await target.coins.fetch();
        const ubal = await message.author.db.coins.fetch();
        if (tbal < MINIMUM_COINS) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription(`Sorry, The victim must have atleast **${MINIMUM_COINS}** coins!`)
            );
        }
        if (ubal < MINIMUM_COINS) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription(`Sorry, You must have atleast **${MINIMUM_COINS}** coins to steal from someone!`)
            );
        }
        const attackPoints = await getOffense(message.author.db);
        const defendPoints = await getDefense(target);
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
            await target.coins.remove(payout);
            await message.author.db.coins.add(payout);
            return message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }) || null)
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
            await message.author.db.coins.remove(lmao);
            return message.channel.send(new MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }) || null)
                .setDescription(`You got caught by the authorities and paid **${lmao}** coins to stay out of prison, OHHH.`)
            );
        }
        await target.coins.add(MINIMUM_COINS);
        await message.author.db.coins.remove(MINIMUM_COINS);
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }) || null)
            .setDescription(`You got caught, and paid **${MINIMUM_COINS}** to the victim, OHHH`)
        );
    }
}