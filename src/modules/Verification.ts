import Client from '../classes/Unicron';
import Guild from '../classes/Guild';
import Member from '../classes/Member';
import { Message, MessageEmbed } from 'discord.js';

export default function (client: Client, message: Message, settings: Guild) {
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
                const member: Member | void = await client.db.members.fetch(message.guild.id, message.author.id).catch(console.log);
                if (member) verified = message.content === `>verify ${member.data.captcha}`;
            }
            if (!verified) return;
            await message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setDescription(`<@${message.author.id}>, you have been verified!`)
            ).then(async (m) => {
                await m.delete({ timeout: 5000 });
                await message.member.roles.add(role);
            }).catch(() => { });
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
}