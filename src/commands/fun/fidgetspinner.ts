import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';

export default class FidgetSpinner extends Command {
    private gateway: string[];
    constructor() {
        super({
            config: {
                name: 'fidgetspinner',
                description: 'Spins a fidget spinner for you and shows for how long it was spinning.',
                permission: 'User',
            },
            options: {
                aliases: ['fidget'],
                cooldown: 8,
                nsfwCommand: false,
                args: false,
                donatorOnly: false,
            }
        });
        this.gateway = [
            'https://i.imgur.com/KJJxVi4.gif',
            'https://media.giphy.com/media/1Ubrzxvik2puE/giphy.gif',
            'https://media.giphy.com/media/l1KVaE9P0XcwJMwrC/giphy.gif'
        ]
    }
    async run(client: Client, message: Message, args: string[]) {
        let spinning = await message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${message.author.tag} is spinning a fidget spinner...`)
            .setImage(this.gateway[Math.floor(Math.random() * this.gateway.length)])
        );

        let timeout = (Math.random() * (60 - 5 + 1)) + 5;
        setTimeout(() => {
            spinning.edit(new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`${message.author.tag}, you spun the fidget spinner for ${timeout.toFixed(2)} seconds.`)
            ).catch(e => {
                client.logger.error(e);
            });
        }, timeout * 1000);
    }
}