import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';
import { VoiceState } from 'discord.js';
import Guild from '../../classes/Guild';

export default class voiceStateUpdate extends DiscordEvent {
    constructor() {
        super('voiceStateUpdate');
    }
    async run(client: Client, oldState: VoiceState, newState: VoiceState) {
        const db: Guild | void = await client.db.guilds.fetch(oldState.guild.id).catch(console.log);
        if (!db) return;
        const enabled = db.dynamicEnabled;
        const waitingRoom = db.dynamicRoom;
        const category = db.dynamicCategory;
        if (!enabled
            || oldState.member.user.bot
            || newState.member.user.bot
            || !oldState.guild.me.permissions.has(['MOVE_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_ROLES'])
            || !category
            || !waitingRoom
            || !newState.guild.channels.cache.has(category)
            || !newState.guild.channels.cache.has(waitingRoom)
        ) return;
        if (newState.channel) {
            if (newState.channel.id === waitingRoom) {
                newState.guild.channels.create(`${newState.member.displayName}'s channel`,
                    {
                        type: 'voice',
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: newState.member.id,
                                allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS', 'USE_VAD', 'MANAGE_ROLES', 'CONNECT']
                            },
                            {
                                id: client.user.id,
                                allow: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'VIEW_CHANNEL', 'CONNECT']
                            }
                        ]
                    }).then((channel) => newState.setChannel(channel)).catch(() => { });
            }
        }
        if (oldState.channel) {
            if (oldState.channel.parent.id === category && oldState.channel.id !== waitingRoom) {
                if (oldState.channel.members.size === 0) {
                    oldState.channel.delete().catch(() => { });
                }
            }
        }
    }
}