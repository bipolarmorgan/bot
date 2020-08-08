const BaseEvent = require('../../classes/WebSocketEvent');

class memberDelete extends BaseEvent {
    constructor() {
        super('memberDelete');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{ guild_id:string, member_id:string }} payload
     */
    run(client, payload) {
        if (!client.db.members.cache.has(payload.guild_id)) return;
        const members = client.db.members.cache.get(payload.guild_id);
        if (members.has(payload.member_id)) members.delete(payload.member_id);
        client.db.members.cache.set(payload.guild_id, members);
    }
}

module.exports = memberDelete;