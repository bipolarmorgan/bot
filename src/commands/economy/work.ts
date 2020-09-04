import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed, Collection } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

import { RandomOption } from '../../utils/Random';

const Jobs = new Collection<string, RandomOption>()
    .set('mailman', {
        max: 1000,
        min: 1000 - 500,
    })
    .set('developer', {
        max: 4000,
        min: 4000 - 1000,
    })
    .set('carpenter', {
        max: 2000,
        min: 2000 - 1000,
    })
    .set('mechanic', {
        max: 3000,
        min: 3000 - 1000,
    })
    .set('police', {
        max: 5000,
        min: 5000 - 1000,
    });

export default class Work extends Command {
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
                usage: 'work <Job>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[], g: Guild, u: User) {
        let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
        let status = true;
        const job = args[0].toLowerCase();
        if (!Jobs.has(job)) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription(`Hey, that is not a valid job.\nAvailable Jobs:\n${Jobs.map((v, k) => k).join(', ')}`)
            );
            return false;
        }
        const payout = client.utils.Random.nextInt(Jobs.get(job));
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