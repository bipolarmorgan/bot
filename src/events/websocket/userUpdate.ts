import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';
import User, { UserData } from '../../classes/User';

export default class userUpdate extends WebSocketEvent {
    constructor() {
        super('userUpdate');
    }
    run(client: Client, payload: UserData) {
        client.db.users.cache.set(payload.id, new User(client, payload));
    }
}