const { MessageEmbed } = require('discord.js');
/**
 * @param {import('discord.js').Message}
 * @param {import('../classes/BaseCommand')} command
 */
module.exports = async (message, command) => {
    if (command.options.nsfwCommand && !message.channel.nsfw) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription(`Sorry, i can\'t run nsfw commands on a non-nsfw channel.`)
        );
        return true;
    }
    return false;
}