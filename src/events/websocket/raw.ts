import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';

export default class Raw extends WebSocketEvent {
    constructor() {
        super('raw');
    }
    async run(client: Client, eventName: string, payload: any) {
        client.server.emit(eventName, payload);
    }
}