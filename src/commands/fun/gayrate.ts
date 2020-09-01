import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class Gayrate extends Command {
    constructor() {
        super({
            config: {
                name: 'gayrate',
                description: 'Gay rate command!',
                permission: 'User',
            },
            options: {
                aliases: ['gay', 'howgay'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        const stat = client.utils.Random.nextInt({ max: 101, min: 0 });
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`Gay Rate hehe`)
            .setDescription(`${target.tag} is ${stat}% gay :rainbow_flag: `)
        );
    }
}