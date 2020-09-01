import DiscordEvent from '../../classes/DiscordEvent';
import Client from '../../classes/Unicron';

export default class Disconnect extends DiscordEvent {
    constructor() {
        super('disconnect');
    }
    async run(client: Client, event: any, code: number) {
        setTimeout(() => {
            client.destroy();
            client.login(process.env.DISCORD_TOKEN);
        }, 10000);
        client.logger.error(`[DISCONNECT] Notice: Disconnected from gateway with code ${code} - Attempting reconnect.`);
        console.log(event);
    }
}