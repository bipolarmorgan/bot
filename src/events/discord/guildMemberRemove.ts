import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';
import { GuildMember } from 'discord.js';
import Guild from '../../classes/Guild';
import Member from '../../classes/Member';

export default class guildMemberRemove extends DiscordEvent {
    constructor() {
        super('guildMemberRemove');
    }
    async run(client: Client, member: GuildMember) {
        if (member.user.bot) return;
        const guild: Guild | void = await client.db.guilds.fetch(member.guild.id).catch(console.log);
        const memberD: Member | void = await client.db.members.fetch(member.guild.id, member.user.id).catch(console.log);
        if (!guild) return;
        if (memberD) {
            const deletion = !(memberD.data && memberD.data.warnings && memberD.data.warnings.length);
            if (deletion) await client.db.members.delete(member.guild.id, member.user.id).catch(console.log);
        }
        const channel_id = guild.farewellChannel;
        const message = guild.farewellMessage;
        const enabled = guild.farewellEnabled;
        if (!channel_id || !enabled || !message) return;
        const channel: any = member.guild.channels.cache.get(channel_id);
        if (!channel || channel.type !== 'text') return;
        channel.send(message
            .replace('{user}', member.user.tag)
            .replace('{userID}', member.user.id)
            .replace(/@everyone/g, '@' + String.fromCharCode(8203) + 'everyone')
            .replace(/@here/g, '@' + String.fromCharCode(8203) + 'here')
        ).catch(() => { });
    }
}