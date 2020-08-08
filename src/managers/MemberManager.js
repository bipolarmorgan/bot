const BaseManager = require('../classes/BaseManager');
const { Collection } = require('discord.js');
const Member = require('../classes/Member');

class MemberManager extends BaseManager {
    constructor(client) {
        super(client);
        /**
         * @type {import('discord.js').Collection<string, import('discord.js').Collection<string, import('../classes/Member')>}
         */
        this.cache;
    }
    /**
     * @returns {Promise<import('../classes/Member')>}
     * @param {string} guild_id
     * @param {string} member_id
     */
    fetch(guild_id, member_id) {
        if (!this.client.db.members.cache.has(guild_id)) this.client.db.members.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            await this.client.server.get(`/api/member/${guild_id}/${member_id}`).catch(reject);
            resolve(this.client.db.members.cache.get(guild_id).get(member_id));
        });
    }
    /**
     * @returns {Promise<Collection<string, import('../classes/Member')>}
     * @param {string} guild_id
     */
    fetchAll(guild_id) {
        if (!this.client.db.members.cache.has(guild_id)) this.client.db.members.cache.set(guild_id, new Collection());
        return new Promise(async (resolve, reject) => {
            /**
             * @type {[{guild_id:string, member: { id:string, data: {}}}]}
             */
            const rawmembers = await this.client.server.get(`/api/members/${guild_id}`).catch(reject);
            const members = this.client.db.members.cache.get(guild_id);
            rawmembers.forEach((t) => {
                members.set(t.member.id, new Member(this.client, t));
            });
            resolve(members);
        });
    }
}

module.exports = MemberManager;