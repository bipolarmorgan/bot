const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

const salary = {
    mailman: {
        max: 1000,
        min: 1000 - 500,
    },
    developer: {
        max: 4000,
        min: 4000 - 1000,
    },
    carpenter: {
        max: 2000,
        min: 2000 - 1000,
    },
    mechanic: {
        max: 3000,
        min: 3000 - 1000,
    },
    police: {
        max: 5000,
        min: 5000 - 1000,
    }
}

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'work',
                description: 'Earn coins by working!\nJobs:\nmailman, developer, carpenter, mechanic, police',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 60 * 15,
                nsfwCommand: false,
                args: true,
                usage: 'work <Job>\nJobs:\n- mailman\n- developer\n- carpenter\n- mechanic\n- police',
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
     * @param {import('../../classes/User')} u
     */
    async run(client, message, args, p, u) {
        let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
        let status = true;
        const job = args[0].toLowerCase();
        if (!job || !['mailman', 'developer', 'carpenter', 'mechanic', 'police'].includes(job)) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription(`Hey, that is not a valid job.\nAvailable Jobs:\nmailman, developer, carpenter, mechanic, police`)
            );
            return false;
        }
        const payout = client.utils.Random.nextInt(salary[job]);
        switch (job) {
            case 'mailman': {
                u.balance += payout;
                embed.setDescription(`You have worked as a ${job} and earned **${payout}** coins!`)
                break;
            }
            case 'developer': {
                if (!u.hasItem('laptop')) {
                    status = false;
                    embed.setDescription(`Hey, you need a laptop to work as a developer.`);
                    break;
                }
                u.balance += payout;
                embed.setDescription(`You have worked as a ${job} and earned **${payout}** coins!`)
                break;
            }
            case 'carpenter': {
                if (!u.hasItem('hammer')) {
                    status = false;
                    embed.setDescription(`Hey, you need a hammer to work as a carpenter.`);
                    break;
                }
                u.balance += payout;
                embed.setDescription(`You have worked as a ${job} and earned **${payout}** coins!`)
                break;
            }
            case 'mechanic': {
                if (!u.hasItem('wrench')) {
                    status = false;
                    embed.setDescription(`Hey, you need a wrench to work as a mechanic.`);
                    break;
                }
                u.balance += payout;
                embed.setDescription(`You have worked as a ${job} and earned **${payout}** coins!`)
                break;
            }
            case 'police': {
                if (!u.hasItem('pistol')) {
                    status = false;
                    embed.setDescription(`Hey, you need a pistol to work as a police.`);
                    break;
                }
                u.balance += payout;
                embed.setDescription(`You have worked as a ${job} and earned **${payout}** coins!`)
                break;
            }
        }
        if (status) await u.save().catch((e) => { throw e; });
        message.channel.send(embed);
        return status;
    }
}