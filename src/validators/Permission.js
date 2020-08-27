const { MessageEmbed } = require('discord.js');
/**
 * @param {import('../classes/Unicron')} client
 * @param {import('discord.js').Message}
 * @param {import('../classes/BaseCommand')} command
 */
module.exports = async (client, message, command) => {
    if (message.author.permLevel < client.permission.cache.get(command.config.permission).level) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription(`You do not have permission to use this command.\nYour permission level is \`${client.permission.levels[message.author.permLevel]}\`\nThis command requires \`${command.config.permission}\``)
        );
        return true;
    }
    return false;
}