const { MessageEmbed } = require('discord.js');
/**
 * @param {import('discord.js').Message}
 * @param {import('../classes/BaseCommand')} command
 * @param {string[]} args
 */
module.exports = (message, command, args) => {
    if (command.options.args && !args.length && command.options.usage) {
        message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setDescription(`You didn't provide any arguments, ${message.author}!\nThe proper usage would be:
\`\`\`html
${command.options.usage}
\`\`\`
                `)
        );
        return true;
    }
    return false;
}