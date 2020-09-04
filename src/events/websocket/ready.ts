import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class Ready extends WebSocketEvent {
    constructor() {
        super('ready');
    }
    run(client: Client) {
        client.logger.info(`Database Connection Established!`);
    }
}