import { Message, MessageEmbed } from "discord.js";
import Command from "../classes/BaseCommand";

export default async function (message: Message, command: Command, args: string[]) {
    if (command.options.args && !args.length && command.options.usage) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
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