import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';

export default class dtname extends Command {
    constructor() {
        super({
            config: {
                name: 'dtname',
                description: 'Rename your private text channel name!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_CHANNELS'],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'dtname <Name>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[], guildSettings: Guild) {
        const category = guildSettings.dynamicCategory;
        const enabled = guildSettings.dynamicEnabled;
        if (!category || !enabled) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Sorry, the Dynamic System for this server is currently disabled\nTry setting this up using `config` command or set this up through our dashboard https://unicron-bot.xyz/')
            );
        }
        const categoryC = message.guild.channels.cache.get(category);
        if (!categoryC || !categoryC.permissionsFor(client.user).has(['MANAGE_CHANNELS'])) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Oh oh, it seems that the dynamic category is deleted or i don\'t have access to it')
            );
        }
        if (message.channel.type !== 'text') return;
        if (message.channel.parentID !== category) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Hey, you can\'t rename the text channel outside a private text channel')
            );
        }
        if (!message.channel.permissionsFor(message.member).has(['MANAGE_CHANNELS'])) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Hey, you can\'t rename the text channel from this private channel')
            );
        }
        const name = args.join(' ').replace(/ +/g, '-').replace(/`/g, '');
        try {
            await message.channel.edit({
                name,
            }).catch((e) => { throw e });
            message.channel.send(`Channel renamed!`);
        } catch (error) {
            message.channel.send(`There was a problem renaming the channel\n${error.message}`);
        }
    }
}