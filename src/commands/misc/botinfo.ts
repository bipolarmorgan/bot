import ms from 'pretty-ms';
import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed, version as discordjsVersion } from 'discord.js';
import Client from '../../classes/Unicron';
const { version } = require('../../../package.json');

export default class BotInfo extends Command {
    constructor() {
        super({
            config: {
                name: 'botinfo',
                description: 'Check\'s bot\'s status',
                permission: 'User',
            },
            options: {
                aliases: ['uptime', 'botstats', 'stats'],
                cooldown: 3,
                args: false,
                usage: '',
                donatorOnly: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Unicron v${version}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addField('Uptime', `${ms(client.uptime)}`, true)
            .addField('WebSocket Ping', `${client.ws.ping}ms`, true)
            .addField('Memory', `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`, true)
            .addField('Guild Count', `${await client.getCount('guilds')} guilds`, true)
            .addField(`User Count`, `${await client.getCount('users')} users`, true)
            .addField('Shard Count', `${client.shard.count} shard(s)`, true)
            .addField('Commands', `${client.commands.size} cmds`,true)
            .addField('Node', `${process.version} on ${process.platform} ${process.arch}`, true)
            .addField('Discord.js', `${discordjsVersion}`, true)
            .setTimestamp()
        );
    }
}