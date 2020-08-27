const { MessageEmbed } = require('discord.js');
const AutoModeration = require('../modules/AutoModeration');
const fs = require('fs');
const swearWords = fs.readFileSync('assets/swearWords.txt').toString().split('\r\n');

const regex = new RegExp(swearWords.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');

/**
 * @param {import('../classes/Unicron')} client
 * @param {import('discord.js').Message} message
 * @param {import('../classes/Guild')} settings
 */
module.exports = (client, message, settings) => {
    return new Promise(async (resolve, reject) => {
        try {
            const status = settings.swearFilter;
            const strat = (status && !message.channel.nsfw && message.author.permLevel < 3 &&
                (
                    message.content.match(regex)
                )
            ) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) await message.delete().catch(() => { });
            await message.channel.send(`No Swearing! ${message.author}.`)
                .then((msg) => msg.delete({ timeout: 5000 })).catch(() => { });
            const mChannel = message.guild.channels.cache.get(settings.modLogChannel);
            if (mChannel) {
                await mChannel.send(new MessageEmbed()
                    .setTimestamp()
                    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle('Swear Blocker')
                    .setDescription(`Member: ${message.author.tag} / ${message.author.id}\nContent: ||${message.content}||`)
                ).catch(() => { });
            }
            await AutoModeration(client, message, message.member, settings).catch(() => { });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}