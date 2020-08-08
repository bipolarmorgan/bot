const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'beg',
                description: 'Beg for coins',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 54,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
        this.messages = {
            on_begged: [
                (c) => `your papa gave you **${c}** coins`,
                (c) => `yo mama gave you **${c}** coins`,
                (c) => `Sugar Daddy gave you **${c}** coins`,
                (c) => `Heres some **${c}** coins`,
                (c) => `yo Teacher gave you **${c}** coins`,
                (c) => `You have been given **${c}** coins from Anonymous`,
                (c) => `i was gonna say no but heres some **${c}** coins`,
                (c) => `hmmmm, alright heres some **${c}** coins`,
                (c) => `You have been given **${c}** coins from me`,

            ],
            not_given: [
                'hmmmmmmmmmm no',
                'no',
                'bruh what? no',
                'hmmm later',
                'later pls',
                'get out of here!',
                'sorry, im too poor',
                'im begging for coins too you know...'
            ]
        };
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
        const chance = client.utils.Random.nextInt({ max: 100, min: 0 }) <= 60;
        if (chance) {
            const user = await client.db.users.fetch(message.author.id);
            const prize = chance + client.utils.Random.nextInt({ max: 250, min: 50 });
            user.balance += prize;
            await user.save().catch((e) => { throw e });
            message.channel.send(this.messages.on_begged[Math.floor(Math.random() * this.messages.on_begged.length)](prize));
            return true;
        }
        message.channel.send(this.messages.not_given[Math.floor(Math.random() * this.messages.not_given.length)]);
    }
}