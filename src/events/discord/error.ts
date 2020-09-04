import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';

export default class ErrorEvent extends DiscordEvent {
    constructor() {
        super('error');
    }
    /**
     * 
     * @param {import('../classes/Unicron')} client 
     */
    async run(client: Client, error: Error) {
        client.logger.error(`An error event was sent by Discord.js: \n${error.name}`);
    }
}