import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';
import { MemberDataD } from '../../classes/Member';

export default class memberDelete extends WebSocketEvent {
    constructor() {
        super('memberDelete');
    }
    run(client: Client, payload: MemberDataD) {
        if (!client.db.members.cache.has(payload.guild_id)) return;
        const members = client.db.members.cache.get(payload.guild_id);
        if (members.has(payload.member_id)) members.delete(payload.member_id);
    }
}