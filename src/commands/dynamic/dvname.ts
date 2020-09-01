import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';

export default class dvname extends Command {
    constructor() {
        super({
            config: {
                name: 'dvname',
                description: 'Rename dynamic voice channel!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'dvlimit <Limit>',
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
        if (!message.member.voice.channel) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('hey, you need to be connected to a voice channel to do this')
            );
        }
        if (message.member.voice.guild.id !== message.guild.id) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Oh oh, it seems that you are connected to a voice channel that is not on this server')
            );
        }
        const channel = message.guild.channels.cache.get(message.member.voice.channelID);
        if (!channel.permissionsFor(message.author).has('MANAGE_CHANNELS')) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Sorry you are not allowed to do that')
            );
        }
        const name = args.join(' ').replace(/`/g,'');
        if (name.length > 12) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Sorry but a voice channel name cannot exceed 12 characters')
            );
        }
        try {
            await channel.setName(name);
            message.channel.send('Dynamic Voice Channel Renamed!');
        } catch (error) {
            message.channel.send(`Oh oh, something went wrong renaming the voice channel\n${error.message}`);
        }
    }
}