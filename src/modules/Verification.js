const { MessageEmbed } = require('discord.js');

/**
 * @param {import('../classes/Unicron')} client
 * @param {import('discord.js').Message} message
 * @param {import('../classes/Guild')} settings
 */
module.exports = (client, message, settings) => {
    return new Promise(async (resolve, reject) => {
        try {
            const channel_id = settings.verificationChannel;
            const type = settings.verificationType;
            const role = settings.verificationRole;
            const enabled = settings.verificationEnabled;
            const stat = (!enabled || !role || !channel_id) ? true : false;
            if (stat || (channel_id !== message.channel.id)) return resolve(false);
            if (message.deletable) message.delete({ timeout: 1000 }).catch(() => { });
            if (type === 'react') return resolve(false);
            let verified = false;
            if (type === 'discrim') {
                verified = message.content === `I am ${message.author.discriminator}`;
            } else if (type === 'captcha') {
                const cptcha = await message.member.db.captcha.fetch();
                verified = message.content === `>verify ${cptcha}`;
            }
            if (!verified) return;
            message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setDescription(`<@${message.author.id}>, you have been verified!`)
            ).then((m) => {
                m.delete({ timeout: 5000 }).catch(() => { });
                if (!message.member.roles.cache.has(role)) message.member.roles.add(role).catch(() => { });
            }).catch(() => { });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}