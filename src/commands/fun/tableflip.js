const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
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
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
        const msg = await message.channel.send('(\\\\°□°)\\\\  ┬─┬');
		for (const frame of this.frames) {
			await client.wait(750);
			await msg.edit(frame);
		}
		return msg;
    }
}