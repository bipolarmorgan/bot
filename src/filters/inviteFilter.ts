import Client from '../classes/Unicron';
import { Message, MessageEmbed } from 'discord.js';
import Guild from '../classes/Guild';
import AutoModeration from '../modules/AutoModeration';

export default function (client: Client, message: Message, settings: Guild) {
    return new Promise(async (resolve, reject) => {
        try {
            const status = settings.inviteFilter;
            const strat = (status && (client.permission.level(message) < 2) && message.content.match(client.utils.Regex.discord.invite)) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) await message.delete().catch(() => { });
            await message.channel.send(`No Advertising! ${message.author}.`)
                .then((msg) => msg.delete({ timeout: 5000 }).catch(() => { }));
            const mChannel: any = message.guild.channels.cache.get(settings.modLogChannel);
            if (mChannel && mChannel.type === 'text') {
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