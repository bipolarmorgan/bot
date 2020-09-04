import Client from '../classes/Unicron';
import BaseManager from '../classes/BaseManager';
import { Collection } from 'discord.js';
import Member from '../classes/Member';

export default class MemberManager extends BaseManager<Collection<string, Member>> {
    constructor(client: Client) {
        super(client);
    }
    fetch(guild_id: string, member_id: string): Promise<Member> {
        if (!this.cache.has(guild_id)) this.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            await this.client.server.get(`/api/member/${guild_id}/${member_id}`).then(async () => {
                await this.client.wait(300);
                return resolve(this.cache.get(guild_id).get(member_id));
            }).catch(reject);
        });
    }
    delete(guild_id: string, member_id: string): Promise<Member> {
        return new Promise(async (resolve, reject) => {
            await this.client.server.delete(`/api/member/${guild_id}/${member_id}`).catch(reject);
            resolve();
        });
    }
}