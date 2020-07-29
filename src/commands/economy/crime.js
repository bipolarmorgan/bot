const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'crime',
                description: 'Commit some crimes to get those precious coins!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 180,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
        this.messages = {
            on_begged: [
                (c) => `You successfully robbed a bank and gain **${c}** coins!`,
                (c) => `You successfully stole **${c}** coins from yo mama and papa -,-`,
                (c) => `You have gain **${c}** coins from a successfull jewelry heist!`
            ],
            caught: [
                (c) => `You have been caught by the POLICE and paid a fine of **${c}** coins!`
            ],
        };
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
        const user = await client.database.users.fetch(message.author.id);
        const cur = user.coins.fetch();
        if (cur < 500) {
            message.channel.send('Sorry, but you need atleast **500** coins to start a crime.');
            return false;
        }
        const chance = client.utils.Random.nextInt({ max: 100, min: 0 }) <= 55;
        if (chance) {
            const prize = chance + client.utils.Random.nextInt({ max: 2250, min: 1000 });
            await user.coins.add(prize);
            message.channel.send(this.messages.on_begged[Math.floor(Math.random() * this.messages.on_begged.length)](prize));
            return true;
        }
        const lmao = client.utils.Random.nextInt({ max: cur - Math.floor(cur * 0.45), min: cur - Math.floor(cur * .75) });
        await user.coins.remove(lmao);
        message.channel.send(this.messages.caught[Math.floor(Math.random() * this.messages.caught.length)](lmao))
        return true;
    }
}