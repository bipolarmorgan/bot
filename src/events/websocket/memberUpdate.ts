import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';
import Member, { MemberDataS } from '../../classes/Member';
import { Collection } from 'discord.js';

export default class memberUpdate extends WebSocketEvent {
    constructor() {
        super('memberUpdate');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client 
     * @param {{}} payload
     */
    run(client: Client, payload: MemberDataS) {
        if (!client.db.members.cache.has(payload.guild_id)) client.db.members.cache.set(payload.guild_id, new Collection());
        const members = client.db.members.cache.get(payload.guild_id);
        members.set(payload.member.id, new Member(client, payload));
    }
}