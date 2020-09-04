import Command from "../classes/BaseCommand";
import { Message, MessageEmbed } from "discord.js";

export default async function (message: Message, command: Command) {
    if (command.options.nsfwCommand && message.channel.type === 'text' && !message.channel.nsfw) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setDescription(`Sorry, i can\'t run nsfw commands on a non-nsfw channel.`)
        );
        return true;
    }
    return false;
}