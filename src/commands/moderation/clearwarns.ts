import Command from '../../classes/BaseCommand';
import { Message, MessageEmbed } from 'discord.js';
import Client from '../../classes/Unicron';
import ms from 'ms';
import Guild from '../../classes/Guild';

export default class Clearwarns extends Command {
    constructor() {
        super({
            config: {
                name: 'clearwarns',
                description: 'Clear warnings of a specific user!',
                permission: 'Server Moderator',
            },
            options: {
                aliases: ['clearwarnings'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: false,
                args: true,
                usage: 'clearwarns <User>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    async run(client: Client, message: Message, args: string[]) {
        const target = await client.resolveUser(args[0]);
        if (!target || target.bot) return message.channel.send(`I can't clear the warnings of an invalid user :/`);
        const member = await client.db.members.fetch(message.guild.id, target.id).catch(console.log);
        if (!member) return message.channel.send(`${target}'s warnings was not cleared, please try again`);
        if (member.data && member.data.warnings) {
            member.data.warnings = [];
            await member.save().catch((e) => { throw e; });
            return message.channel.send(`${target}'s warnings cleared!`);
        }
        return message.channel.send(`${target}'s warnings was not cleared, because he/she doesn't have any warnings :P`);
    }
}