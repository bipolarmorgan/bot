const { MessageEmbed } = require('discord.js');
/**
 * @param {import('discord.js').Message}
 * @param {import('../classes/BaseCommand')} command
 */
module.exports = (message, command) => {
    if (command.options.nsfwCommand && !message.channel.nsfw) {
        message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription(`Sorry, i can\'t run nsfw commands on a non-nsfw channel.`)
        );
        return true;
    }
    return false;
}