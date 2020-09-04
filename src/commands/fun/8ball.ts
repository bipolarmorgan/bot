import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';

export default class EightBall extends Command {
    private answers: string[];
    constructor() {
        super({
            config: {
                name: '8ball',
                description: '8Ball command which replies to a yes or no question',
                permission: 'User',
            },
            options: {
                aliases: ['8-ball'],
                cooldown: 10,
                args: true,
                usage: '8ball [question]',
            }
        });
        this.answers = [
            'yes',
            'no',
            'maybe',
            'sort of',
            'can\'t tell',
            'ofc not',
            'probably',
            'yes but no',
            'no but yes',
            'yep',
            'nope',
            'i don\'t think so',
            'well yes but actually no',
            'well no but actually yes',
            'omg yes!',
            'nooooo'
        ];
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(this.answers[Math.floor(Math.random() * this.answers.length)]);
    }
}