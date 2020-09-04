import BaseManager from '../classes/BaseManager';
import Client from '../classes/Unicron';
import User from '../classes/User';

export default class UserManager extends BaseManager<User> {
    constructor(client: Client) {
        super(client);
    }
    fetch(user_id: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            if (this.cache.has(user_id)) return resolve(this.cache.get(user_id));
            await this.client.server.get(`/api/user/${user_id}`).then(async () => {
                await this.client.wait(300);
                return resolve(this.cache.get(user_id));
            }).catch(reject);
        });
    }
    delete(user_id: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.client.server.delete(`/api/user/${user_id}`).catch(reject);
            resolve();
        });
    }
}