const BaseManager = require('../classes/BaseManager');
const { Cooldowns } = require('../database/');
const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

class CooldownManager extends BaseManager {
    constructor(client) {
        super(client);
        /**
         * @type {import('discord.js').Collection<string>}
         */
        this.cache;
    }
    /**
     * @private
     */
    async findOrCreate(name) {
        let cc = await Cooldowns.findOne({ where: { name } });
        if (!cc) cc = await Cooldowns.create({ name });
        return cc;
    }
    /**
     * 
     * @param {import('discord.js').Message} message 
     * @param {import('../classes/BaseCommand')} command 
     * @param {import('../classes/User')} userStats
     */
    commandThrottle(message, command, userStats) {
        return new Promise(async (resolve, reject) => {
            const ccs = await this.findOrCreate(command.config.name);
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
            if (!ccs.data) ccs.data = [];
            if (ccs.data.find((u) => u.id === message.author.id)) {
                const expirationTime = ccs.data.find((u) => u.id === message.author.id).timestamp + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = Math.floor(expirationTime - now);
                    const donCD = Math.floor(bcd - (bcd * 0.35));
                    return resolve(message.channel.send(new MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setDescription(` ${await this.client.getEmoji('slowmode')} Please wait **${ms(timeLeft)}** before reusing the command again.\n[Donators](${this.client.unicron.serverInviteURL}) will only have to wait **${ms(donCD)}**!`)
                    ));
                } else {
                    await Cooldowns.update({ data: ccs.data.filter((i) => i.id !== message.author.id) }, { where: { name: command.config.name } });
                }
            }
            return resolve(false);
        });
    }
    async throttle(name, id) {
        const ccs = await this.findOrCreate(name);
        const timestamp = Date.now();
        if (!ccs.data) ccs.data = [];
        ccs.data.push({ id, timestamp });
        await Cooldowns.update({ data: ccs.data }, { where: { name } });
    }
}

module.exports = CooldownManager;