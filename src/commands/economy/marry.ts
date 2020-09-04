import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class Marry extends Command {
    constructor() {
        super({
            config: {
                name: 'marry',
                description: 'Marry someone using this command. O.o <3',
                permission: 'User',
            },
            options: {
                aliases: ['merry'],
                clientPermissions: [],
                cooldown: 1200,
                nsfwCommand: false,
                args: true,
                usage: 'marry [User]',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[], g: Guild, userStats: User) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You gotta mention who to marry -_-')
            );
        }
        if (target.bot) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You can\'t marry a bot user :P')
            );
        }
        if (message.author.equals(target)) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, You can\'t marry yourself :P')
            );
        }
        const ttarget = await client.db.users.fetch(target.id).catch((e) => { throw e; });
        const tID = ttarget.marriage_id;
        const mID = userStats.marriage_id;
        if (tID === message.author.id) {
            return message.channel.send(new MessageEmbed()
                .setColor(0x00FF00)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Woah, you two are already married.. <3')
            );
        }
        if (tID) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Sorry, but that person is already married to someone else -,-')
            );
        }
        if (mID) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Woah, you are already married to someone else -.-')
            );
        }
        const filter = (response: Message) => response.author.id === target.id && ['yes'].includes(response.content.toLowerCase());
        message.channel.send(`Hey ${target} will you accept ${message.author} as your beloved husband/wife? yes or no`);
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(async () => {
                userStats.marriage_id = target.id;
                ttarget.marriage_id = message.author.id;
                await userStats.save().catch((e) => { throw e; });
                await ttarget.save().catch((e) => { throw e; });
                return message.channel.send(`🎉 ${message.author} and ${target} has been married yay!. 🎉`);
            }).catch(() => {
                message.channel.send('Looks like nobody is getting married today.');
            });
    }
}