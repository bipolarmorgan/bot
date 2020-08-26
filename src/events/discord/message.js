const { Collection, MessageEmbed } = require('discord.js');
const BaseEvent = require('../../classes/DiscordEvent');
/**
 * @type {Collection<string, boolean>}
 */
const xpcooldown = new Collection();

const inviteFilter = require('../../filters/inviteFilter');
const mentionSpamFilter = require('../../filters/mentionSpamFilter');
const swearFilter = require('../../filters/swearFilter');
const memberVerification = require('../../modules/Verification');

const PremiumServer = require('../../validators/PremiumServer');
const Permission = require('../../validators/Permission');
const ClientPermission = require('../../validators/ClientPermissions');
const CommandArgs = require('../../validators/CommandArgs');
const NSFWCommand = require('../../validators/NSFWCommand');

module.exports = class extends BaseEvent {
    constructor() {
        super('message');
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').Message} message
     */
    async run(client, message) {

        if (!message) return;
        if (message.partial) await message.fetch().catch(() => { });
        if (message.channel.type === 'dm') return client.emit('directMessage', client, message);
        if (message.author.bot || message.channel.type !== 'text' || !message.guild) return;
        if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES'])) return;
        if (!message.member) await message.member.fetch().catch(() => { });

        const guildSettings = await client.db.guilds.fetch(message.guild.id).catch(console.log);
        message.author.permLevel = client.permission.level(message);

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

        if (PremiumServer(message, command, guildSettings.premium)) return;
        if (Permission(client, message, command)) return;
        if (ClientPermission(message, command)) return;
        if (CommandArgs(message, command, args)) return;
        if (NSFWCommand(message, command)) return;

        const userStats = await client.db.users.fetch(message.author.id).catch(console.log);

        if (await client.db.cooldowns.checkCommand(message, command, userStats)) return;

        try {
            if (!xpcooldown.has(message.author.id)) {
                await userStats.addXP(client, message).catch((e) => { throw e; });
                xpcooldown.set(message.author.id, true);
                client.setTimeout(() => xpcooldown.delete(message.author.id), 30000);
            }
            client.logger.info(`Shard[${message.guild.shardID}][${message.guild.id}] (${message.author.tag}/${message.author.id}) ${commandName} ${args.join(' ')}`);
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