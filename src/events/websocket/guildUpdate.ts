import WebSocketEvent from '../../classes/WebSocketEvent';
import Client from '../../classes/Unicron';
import Guild, { GuildSettings } from '../../classes/Guild';

class guildUpdate extends WebSocketEvent {
    constructor() {
        super('guildUpdate');
    }
    run(client: Client, payload: GuildSettings) {
        client.db.guilds.cache.set(payload.id, new Guild(client, payload));
    }
}

module.exports = guildUpdate;