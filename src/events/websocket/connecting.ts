import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class Connecting extends WebSocketEvent {
    constructor() {
        super('connecting');
    }
    run(client: Client) {
        client.logger.info(`Connecting to the Database Server...`);
    }
}