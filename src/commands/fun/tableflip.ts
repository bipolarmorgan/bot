import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class TableFlip extends Command {
    private frames: string[];
    constructor() {
        super({
            config: {
                name: 'tableflip',
                description: 'Tableflip! with animation!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
        this.frames = [
            '(-°□°)-  ┬─┬',
            '(╯°□°)╯    ]',
            '(╯°□°)╯  ︵  ┻━┻',
            '(╯°□°)╯       [',
            '(╯°□°)╯           ┬─┬'
        ];
    }
    async run(client: Client, message: Message, args: string[]) {
        const msg = await message.channel.send('(\\\\°□°)\\\\  ┬─┬');
		for (const frame of this.frames) {
			await client.wait(800);
			await msg.edit(frame);
		}
		return msg;
    }
}