const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('voiceStateUpdate');
    }
    /**
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').VoiceState} oldState
     * @param {import('discord.js').VoiceState} newState
     */
    async run(client, oldState, newState) {
        let db = await client.db.guilds.fetch(oldState.guild.id).catch(console.log);
        if (!db) db = await client.db.guilds.fetch(oldState.guild.id).catch(console.log);
        const enabled = db.dynamicEnabled;
        const waitingRoom = db.dynamicRoom;
        const category = db.dynamicCategory;
        if (!enabled
            || oldState.member.user.bot
            || newState.member.user.bot
            || !oldState.guild.me.permissions.has(['MOVE_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_ROLES'])
            || !category
            || !waitingRoom
            || !newState.guild.channels.cache.get(category)
            || !newState.guild.channels.cache.get(waitingRoom)
        ) return;

        if (newState.channel) {
            const dvlimit = newState.channel.parentID === category ? 11 : 10;
            if (newState.channel.id === waitingRoom && newState.channel.parent.children.filter((c) => c.type === 'voice').size <= dvlimit) {
                newState.guild.channels.create(`${newState.member.displayName}'s channel`,
                    {
                        type: 'voice',
                        parent: category,
                        permissionOverwrites: [
                            {
                                id: newState.member.id,
                                allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS', 'USE_VAD', 'MANAGE_ROLES']
                            }
                        ]
                    }).then(channel => {
                        newState.setChannel(channel).catch(() => { });
                    }).catch(() => { });
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