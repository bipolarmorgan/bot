import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class ErrorEvent extends WebSocketEvent {
    constructor() {
        super('error');
    }
    run(client: Client, err: any) {
        client.logger.error(err);
    }
}