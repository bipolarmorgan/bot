import https from 'https';
import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

const url = [
    'https://www.reddit.com/r/dankmemes/hot/.json?limit=100',
    'https://www.reddit.com/r/memes/hot/.json?limit=100',
];

export default class Meme extends Command {
    constructor() {
        super({
            config: {
                name: 'meme',
                description: 'Meme Generator 101',
                permission: 'User',
            },
            options: {
                aliases: ['dankmeme'],
                cooldown: 10,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        https.get(url[Math.floor(Math.random() * url.length)], (result) => {
            let body = '';
            result.on('data', (chunk) => {
                body += chunk;
            });
            result.on('end', () => {
                let response = JSON.parse(body);
                let index = response.data.children[Math.floor(Math.random() * 99) + 1].data;
                let title = index.title;
                if (index.post_hint !== 'image') {
                    return message.channel.send(new MessageEmbed()
                        .setAuthor('r/dankmemes')
                        .setColor('RANDOM')
                        .setDescription(`[${title}](${client.unicron.serverInviteURL})`));
                }
                let image = index.url;
                return message.channel.send(new MessageEmbed()
                    .setAuthor('r/dankmemes')
                    .setImage(image)
                    .setColor('RANDOM')
                    .setDescription(`[${title}](${client.unicron.serverInviteURL})`));
            }).on('error', error => {
                client.logger.error(error);
                return false;
            });
        });
    }
}