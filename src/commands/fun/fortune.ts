import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import fortune from '../../assets/fortuneCookies';

export default class Fortune extends Command {
    constructor() {
        super({
            config: {
                name: 'fortune',
                description: 'Shows you a fortune from a fortune cookie.',
                permission: 'User',
            },
            options: {
                aliases: ['cookie'],
                cooldown: 15,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor('Your fortune says...', client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(fortune[Math.floor(Math.random() * fortune.length)])
        );
    }
}