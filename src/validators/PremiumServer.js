const { MessageEmbed } = require('discord.js');
/**
 * @param {import('discord.js').Message}
 * @param {import('../classes/BaseCommand')} command
 * @param {boolean} premium
 */
module.exports = async (message, command, premium) => {
    if (command.options.premiumServer && !premium) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription(`Sorry, this command is only available for [Premium Servers](${client.unicron.serverInviteURL}`)
        );
        return true;
    }
    return false;
}