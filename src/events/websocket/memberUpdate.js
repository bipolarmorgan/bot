const BaseEvent = require('../../classes/WebSocketEvent');
const { Collection } = require('discord.js');
const Member = require('../../classes/Member');

class memberUpdate extends BaseEvent {
    constructor() {
        super('memberUpdate');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{}} payload
     */
    run(client, payload) {
        if (!client.db.members.cache.has(payload.guild_id)) client.db.members.cache.set(payload.guild_id, new Collection());
        const members = client.db.members.cache.get(payload.guild_id);
        members.set(payload.member.id, new Member(client, payload));
        client.db.members.cache.set(payload.guild_id, members);
    }
}

module.exports = memberUpdate;