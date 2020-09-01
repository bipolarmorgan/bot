import { Message, MessageEmbed } from 'discord.js';
import Command from '../classes/BaseCommand';
import Client from '../classes/Unicron';

export default async function (client: Client, message: Message, command: Command, premium: boolean) {
    if (command.options.premiumServer && !premium) {
        await message.channel.send(new MessageEmbed()
            .setColor('RED')
            .setDescription(`Sorry, this command is only available for [Premium Servers](${client.unicron.serverInviteURL}`)
        );
        return true;
    }
    return false;
}