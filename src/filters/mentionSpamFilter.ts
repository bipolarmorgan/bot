import Client from '../classes/Unicron';
import { Message, MessageEmbed } from 'discord.js';
import Guild from '../classes/Guild';
import AutoModeration from '../modules/AutoModeration';

export default function (client: Client, message: Message, settings: Guild) {
    return new Promise(async (resolve, reject) => {
        try {
            const status = settings.mentionSpamFilter;
            const strat = (status && (client.permission.level(message) < 2) && ((message.mentions.users.size > 6) || (message.mentions.roles.size > 6))) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) await message.delete().catch(() => { });
            await message.channel.send(`Don't mention too many people! ${message.author}.`)
                .then(msg => msg.delete({ timeout: 5000 }).catch(() => { }));
            const mChannel: any = message.guild.channels.cache.get(settings.modLogChannel);
            if (mChannel && mChannel.type === 'text') {
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