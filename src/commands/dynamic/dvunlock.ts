import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';

module.exports = class extends Command {
    constructor() {
        super({
            config: {
                name: 'dvunlock',
                description: 'Unlock your dynamic voice channel for anyone to join!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_CHANNELS'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: 'dvunlock',
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
                .setDescription('Sorry, you are not allowed to do that')
            );
        }
        try {
            await channel.overwritePermissions([
                {
                    id: message.author.id,
                    allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS', 'USE_VAD', 'MANAGE_ROLES', 'CONNECT'],
                },
                {
                    id: client.user.id,
                    allow: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'VIEW_CHANNEL', 'CONNECT']
                },
            ]);
            message.channel.send('Your voice channel has been unlocked!');
        } catch (error) {
            message.channel.send(`Oh oh, something went wrong setting the unlocking the voice channel\n${error.message}`);
        }
    }
}