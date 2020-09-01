import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class userDelete extends WebSocketEvent {
    constructor() {
        super('userDelete');
    }
    run(client: Client, payload_id: string) {
        client.db.users.cache.delete(payload_id);
    }
}