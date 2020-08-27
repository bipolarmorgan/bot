const { MessageEmbed } = require('discord.js');
const AutoModeration = require('../modules/AutoModeration');

/**
 * @param {import('../classes/Unicron')} client
 * @param {import('discord.js').Message} message
 * @param {import('../classes/Guild')} settings
 */
module.exports = (client, message, settings) => {
    return new Promise(async (resolve, reject) => {
        try {
            const status = settings.mentionSpamFilter;
            const strat = (status && (message.author.permLevel < 2) && ((message.mentions.users.size > 6) || (message.mentions.roles.size > 6))) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) await message.delete().catch(() => { });
            await message.channel.send(`Don't mention too many people! ${message.author}.`)
                .then(msg => msg.delete({ timeout: 5000 }).catch(() => { }));
            const mChannel = message.guild.channels.cache.get(settings.modLogChannel);
            if (mChannel) {
                await mChannel.send(new MessageEmbed()
                    .setTimestamp()
                    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle('Mention Spam Blocker')
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