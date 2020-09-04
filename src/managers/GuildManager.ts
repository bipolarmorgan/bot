import BaseManager from '../classes/BaseManager';
import Client from '../classes/Unicron';
import Guild from '../classes/Guild';

export default class GuildManager extends BaseManager<Guild> {
    constructor(client: Client) {
        super(client);
    }
    fetch(guild_id: string): Promise<Guild> {
        return new Promise(async (resolve, reject) => {
            if (this.cache.has(guild_id)) return resolve(this.cache.get(guild_id));
            await this.client.server.get(`/api/guild/${guild_id}`).then(async () => {
                await this.client.wait(300);
                return resolve(this.cache.get(guild_id));
            }).catch(reject);
        });
    }
    delete(guild_id: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.client.server.delete(`/api/guild/${guild_id}`).catch(reject);
            resolve();
        });
    }
}