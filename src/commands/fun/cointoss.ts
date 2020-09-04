import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Cointoss extends Command {
    private answers: string[];
    constructor() {
        super({
            config: {
                name: 'cointoss',
                description: 'Tails or Head?',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
        this.answers = ['🤴 Heads!', '🐛 Tails!'];
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(this.answers[Math.floor(Math.random() * this.answers.length)]);
    }
}