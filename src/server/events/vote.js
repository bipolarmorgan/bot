const BaseEvent = require('../../classes/BaseEvent');
const User = require('../../classes/User');
const { UserProfile } = require('../../database/database');

module.exports = class extends BaseEvent {
    constructor() {
        super('vote');
    }
    /**
     * 
     * @param {import('../classes/Server')} client 
     * @param {import('../../classes/Voter')} voter 
     */
    async run(client, voter) {
        let data = await UserProfile.findOne({ where: { user_id: voter.id } });
        if (!data) data = await UserProfile.create({ user_id: voter.id });
        const db = new User(voter.id, data);
        await db.badges.add('voter');
        await db.inventory.add('votebox');
        client.logger.info(`${voter.id} voted on ${voter.list}`);
    }
}