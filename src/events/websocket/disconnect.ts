import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class Disconnect extends WebSocketEvent {
    constructor() {
        super('disconnect');
    }
    run(client: Client) {
        client.logger.warn(`[NOTICE] Database Connection Disconnected`);

    }
}