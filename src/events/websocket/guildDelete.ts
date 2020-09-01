import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class guildDelete extends WebSocketEvent {
    constructor() {
        super('guildDelete');
    }
    run(client: Client, payload_id: string) {
        client.db.guilds.cache.delete(payload_id);
        client.db.members.cache.delete(payload_id);
    }
}