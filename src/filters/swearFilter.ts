import fs from 'fs';
import Client from '../classes/Unicron';
import Guild from '../classes/Guild';
import AutoModeration from '../modules/AutoModeration';
import { Message, MessageEmbed } from 'discord.js';

const swearWords = fs.readFileSync('assets/swearWords.txt').toString().split('\r\n');
const regex = new RegExp(swearWords.map((s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');

export default function (client: Client, message: Message, settings: Guild) {
    return new Promise(async (resolve, reject) => {
        try {
            const status = settings.swearFilter;
            const strat = (
                status && message.channel.type === 'text' && 
                !message.channel.nsfw && client.permission.level(message) < 3 
                && message.content.match(regex)
            ) ? true : false;
            if (!strat) return resolve(false);
            if (message.deletable) await message.delete().catch(() => { });
            await message.channel.send(`No Swearing! ${message.author}.`)
                .then((msg) => msg.delete({ timeout: 5000 })).catch(() => { });
            const mChannel: any = message.guild.channels.cache.get(settings.modLogChannel);
            if (mChannel && mChannel.type === 'text') {
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