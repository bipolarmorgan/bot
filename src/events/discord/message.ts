import DiscordEvent from '../../classes/DiscordEvent';
import { Collection, MessageEmbed, Message } from 'discord.js';
import Client from '../../classes/Unicron';
import inviteFilter from '../../filters/inviteFilter';
import mentionSpamFilter from '../../filters/mentionSpamFilter';
import swearFilter from '../../filters/swearFilter';
import memberVerification from '../../modules/Verification';
import PremiumServer from '../../validators/PremiumServer';
import Permission from '../../validators/Permission';
import ClientPermission from '../../validators/ClientPermissions';
import CommandArgs from '../../validators/CommandArgs';
import NSFWCommand from '../../validators/NSFWCommand';
import Guild from '../../classes/Guild';
import User from '../../classes/User';

export default class MessageEvent extends DiscordEvent {
    private xpcooldown: Collection<string, boolean>;
    constructor() {
        super('message');
        this.xpcooldown = new Collection<string, boolean>();
    }
    async run(client: Client, message: Message) {
        if (!message || message.author.bot) return;
        if (message.channel.type === 'dm') return client.emit('directMessage', message);
        if (message.channel.type !== 'text' || !message.guild) return;
        if (message.channel.parentID === '748855168308609024') return client.emit('directMessage', message, true);
        if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) return;
        if (!message.member) await message.member.fetch().catch(() => { });
        const guildSettings: Guild | void = await client.db.guilds.fetch(message.guild.id).catch(console.log);
        if (!guildSettings) return;

        if (await memberVerification(client, message, guildSettings)) return;
        if (await swearFilter(client, message, guildSettings)) return;
        if (await inviteFilter(client, message, guildSettings)) return;
        if (await mentionSpamFilter(client, message, guildSettings)) return;

        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.escapeRegex(guildSettings.prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.options.aliases && cmd.options.aliases.includes(commandName));
        if (!command) return;

        if (await PremiumServer(client, message, command, guildSettings.premium)) return;
        if (await Permission(client, message, command)) return;
        if (await ClientPermission(message, command)) return;
        if (await CommandArgs(message, command, args)) return;
        if (await NSFWCommand(message, command)) return;

        const userStats: User | void = await client.db.users.fetch(message.author.id).catch(console.log);
        if (!userStats) return;

        if (await client.db.cooldowns.commandThrottle(message, command, userStats)) return;

        try {
            if (!this.xpcooldown.has(message.author.id)) {
                await userStats.addXP(message).catch((e) => { throw e; });
                this.xpcooldown.set(message.author.id, true);
                client.setTimeout(() => this.xpcooldown.delete(message.author.id), 30000);
            }
            client.logger.info(`Shard[${message.guild.shardID}] [${message.guild.name}/${message.guild.id}] (${message.author.tag}/${message.author.id}) ${command.config.name} ${args.join(' ')}`);
            const argv = command.argsDefinitions ? client.utils.Parse(args, command.argsDefinitions) : args;
            const success = await command.run(client, message, argv, guildSettings, userStats).catch((e) => { throw e; });
            if (success !== false) await client.db.cooldowns.throttle(command.config.name, message.author.id);
        } catch (e) {
            message.channel.send(new MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setDescription(`Something went wrong executing that command\nError Message: \`${e.message ? e.message : e}\``)
            );
            client.logger.error(e);
        }
    }
}