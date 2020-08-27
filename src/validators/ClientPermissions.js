const { MessageEmbed } = require('discord.js');
/**
 * @param {import('discord.js').Message}
 * @param {import('../classes/BaseCommand')} command
 */
module.exports = async (message, command) => {
    if (command.options.clientPermissions && (!message.guild.me.permissions.has(command.options.clientPermissions) || !message.channel.permissionsFor(message.guild.me).has(command.options.clientPermissions))) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
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