import Command from "../classes/BaseCommand";
import { Message, MessageEmbed } from "discord.js";
import Client from "../classes/Unicron";

export default async function (client: Client, message: Message, command: Command) {
    if (client.permission.level(message) < client.permission.cache.get(command.config.permission).level) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setDescription(`You do not have permission to use this command.\nYour permission level is \`${client.permission.levels[client.permission.level(message)]}\`\nThis command requires \`${command.config.permission}\``)
        );
        return true;
    }
    return false;
}