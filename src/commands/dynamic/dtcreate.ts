import Command from '../../classes/BaseCommand';
import { MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Guild from '../../classes/Guild';
import GuildTexts from '../../classes/GuildTexts';

export default class dtcreate extends Command {
    constructor() {
        super({
            config: {
                name: 'dtcreate',
                description: 'Creates your own private text channel with ease!',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            },
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
        if (message.channel.parentID === category) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('Hey, you can\'t create a dynamic text inside a dynamic text channel')
            );
        }
        const texts = new GuildTexts(message.guild.id);
        const cur = await texts.find(message.author.id);
        if (cur) {
            return message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setDescription('Oi, you can\'t create a new private text channel when you already have a private text channel :p')
            );
        }
        const channel = await message.guild.channels.create(client.utils.Random.string(12), {
            type: 'text',
            parent: category,
            topic: `Private Text Channel Owner: ${message.author.tag} / ${message.author.id}`,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS'],
                },
                {
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'SEND_MESSAGES'],
                }
            ],
        }).catch((e) => { throw e });
        await texts.open({id: message.author.id, channel: channel.id });
        await message.channel.send(new MessageEmbed()
            .setColor(0x00FF00)
            .setDescription(`Your private text channel has been created! <#${channel.id}>`)
            .setTimestamp()
            .setAuthor('Unicron Dynamic Text System', client.user.displayAvatarURL({ dynamic: true }))
        );
        const st = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'dynamic mod');
        if (st) {
            await channel.createOverwrite(st, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                MANAGE_CHANNELS: true,
            }).catch(() => { });
        }
        await channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Hello ${message.author.tag}, welcome to your own private text channel!\n
Private Text Channel Commands!
\`\`\`bash
dtinvite <User> 
# to invite users to this text channel
dtkick <User> 
# to kick users from this text channel
dtmute <User> [Duration] 
# to mute a user from this text channel
dtunmute <User> 
# to unmute a user from this text channel
dtname <Name> 
# to rename this channel's name
dtclose 
# to delete/close this text channel
\`\`\`
            `)
        );
        return true;
    }
}