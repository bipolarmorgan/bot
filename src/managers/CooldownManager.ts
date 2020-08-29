import Client from '../classes/Unicron';
import User from '../classes/User';
import BaseCommand from '../classes/BaseCommand';
import BaseManager from '../classes/BaseManager';
import ms from 'ms';
import { MessageEmbed, Message } from 'discord.js';
import db from '../database/';

export default class CooldownManager extends BaseManager<null> {
    constructor(client: Client) {
        super(client);
    }
    private async findOrCreate(name: string) {
        let cc = await db.Cooldowns.findOne({ where: { name } });
        if (!cc) cc = await db.Cooldowns.create({ name });
        return cc.getDataValue('data');
    }
    commandThrottle(message: Message, command: BaseCommand, userStats: User) {
        return new Promise(async (resolve, reject) => {
            let ccs = await this.findOrCreate(command.config.name);
            const now = Date.now();
            let cooldownAmount = (command.options.cooldown || 3) * 1000;
            const donator = userStats.data && userStats.data.premium || false;
            const bcd = cooldownAmount + 0;
            if (command.options.donatorOnly && !donator) {
                return resolve(message.channel.send(new MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setDescription(`Sorry, this command is limited only for [Donators](${this.client.unicron.serverInviteURL})`)
                ));
            }
            if (donator) cooldownAmount = Math.floor(cooldownAmount - (cooldownAmount * 0.35));
            if (!ccs) ccs = [];
            if (ccs.find((u: any) => u.id === message.author.id)) {
                const expirationTime = ccs.find((u: any) => u.id === message.author.id).timestamp + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = Math.floor(expirationTime - now);
                    const donCD = Math.floor(bcd - (bcd * 0.35));
                    return resolve(message.channel.send(new MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setDescription(` ${await this.client.getEmoji('slowmode')} Please wait **${ms(timeLeft)}** before reusing the command again.\nDefault Cooldown for this command is **${ms(bcd)}**\nWhile [Donators](${this.client.unicron.serverInviteURL}) will only have to wait **${ms(donCD)}**!`)
                    ));
                } else {
                    await db.Cooldowns.update({ data: ccs.filter((i: any) => i.id !== message.author.id) }, { where: { name: command.config.name } });
                }
            }
            return resolve(false);
        });
    }
    async throttle(name: string, id: string) {
        let ccs = await this.findOrCreate(name);
        const timestamp = Date.now();
        if (!ccs) ccs = [];
        ccs.push({ id, timestamp });
        await db.Cooldowns.update({ data: ccs }, { where: { name } });
    }
}