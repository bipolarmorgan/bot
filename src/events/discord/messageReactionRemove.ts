import Client from '../../classes/Unicron';
import DiscordEvent from '../../classes/DiscordEvent';
import { MessageReaction, MessageEmbed, User } from 'discord.js';
import Guild from '../../classes/Guild';

export default class messageReactionRemove extends DiscordEvent {
    constructor() {
        super('messageReactionRemove');
    }
    async run(client: Client, reaction: MessageReaction, user: User) {
        try {
            if (reaction.partial) await reaction.fetch().catch(() => { });
            if (user.bot) return;
            if (!reaction.message.guild) return;
            const guild: Guild | void = await client.db.guilds.fetch(reaction.message.guild.id).catch(console.log);
            if (!guild) return;
            const isReact = guild.verificationType;
            const channel_id = guild.verificationChannel;
            const status = guild.verificationEnabled;
            const role = guild.verificationRole;
            if (!role
                || !status
                || (channel_id !== reaction.message.channel.id)
                || (isReact !== 'react')
                || (reaction.emoji.name !== 'yes')
                || !reaction.message.guild.me.permissions.has(['MANAGE_ROLES'])
                || !reaction.message.guild.roles.cache.has(role)
            ) return;
            const member = await reaction.message.guild.members.fetch(user.id).catch(() => { });
            if (member) {
                await member.roles.remove(role)
                    .then(() => reaction.message.channel.send(new MessageEmbed().setColor(0x00FF00).setTimestamp().setDescription(`You have been unverified <@${user.id}>`)))
                    .then((m) => m.delete({ timeout: 5000 }))
                    .catch(() => { });
            }
        } catch (e) {
            client.logger.error(e);
        }
    }
}