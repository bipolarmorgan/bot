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
            const status = settings.inviteFilter;
            const strat = (status && (message.author.permLevel < 2) && message.content.match(client.utils.Regex.discord.invite)) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) await message.delete().catch(() => { });
            await message.channel.send(`No Advertising! ${message.author}.`)
                .then((msg) => msg.delete({ timeout: 5000 }).catch(() => { }));
            const mChannel = message.guild.channels.cache.get(settings.modLogChannel);
            if (mChannel) {
                await mChannel.send(new MessageEmbed()
                    .setTimestamp()
                    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle('Invite Blocker')
                    .setDescription(`Member: ${message.author.tag} / ${message.author.id}`)
                ).catch(() => { });
            }
            await AutoModeration(client, message, message.member, settings).catch(() => { });
            return resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}