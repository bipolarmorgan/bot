import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import ms from 'ms';

export default class dtmute extends Command {
    constructor() {
        super({
            config: {
                name: 'dtmute',
                description: 'Mute a user from your private text channel!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'dtmute <User> [Duration]',
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
                .setDescription('Hey, you can\'t mute users outside a private text channel')
            );
        }
        if (!message.channel.permissionsFor(message.member).has(['MANAGE_CHANNELS'])) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Hey, you can\'t mute users from this private channel')
            );
        }
        const target = message.mentions.users.first();
        if (!target) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Hey, you need to mention who you gonna mute from this channel.')
            );
        }
        await message.channel.updateOverwrite(target, {
            SEND_MESSAGES: false,
        }).catch(() => { });
        if (args[1]) {
            const duration = ms(args[1]);
            if (!isNaN(duration)) {
                client.setTimeout(() => {
                    if (message.channel.type !== 'text') return;
                    message.channel.updateOverwrite(target, {
                        SEND_MESSAGES: true
                    }).catch(() => { });
                }, duration);
            }
        }
        message.channel.send(`${target} has been muted from this channel`);
    }
}