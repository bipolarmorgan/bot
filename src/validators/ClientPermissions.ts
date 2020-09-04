import { MessageEmbed, Message } from 'discord.js';
import Command from '../classes/BaseCommand';

export default async function (message: Message, command: Command) {
    if (message.channel.type === 'text' && command.options.clientPermissions && (!message.guild.me.permissions.has(command.options.clientPermissions) || !message.channel.permissionsFor(message.guild.me).has(command.options.clientPermissions))) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setDescription(`Sorry, but i need the following permisions to perform this command
\`\`\`xl
${command.options.clientPermissions.join(' ')}
\`\`\`
                    `)
        );
        return true;
    }
    return false;
}