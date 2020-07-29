const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'support',
                description: 'Shows Unicron\'s Support Server, Invite link and donate link.',
                permission: 'User',
            },
            options: {
                aliases: ['invite', 'donate'],
                clientPermissions: ['EMBED_LINKS'],
                cooldown: 3,
                nsfwCommand: false,
                args: false,
                usage: '',
                donatorOnly: false,
            }
        });
    }
    /**
     * @returns {Promise<import('discord.js').Message|boolean>}
     * @param {import('../../classes/Unicron')} client 
     * @param {import('discord.js').Message} message 
     * @param {Array<string>} args 
     */
    async run(client, message, args) {
        const OWNER = await client.users.fetch(client.unicron.owner, false);
        return message.channel.send(new MessageEmbed()
            .setColor(0x00FFFF)
            .setTitle('Unicron')
            .setDescription(`
[Unicron's Support Server](${client.unicron.serverInviteURL})
[Invite Unicron to your server](https://discord.com/oauth2/authorize?client_id=634908645896880128&scope=bot&permissions=285599830)
[Donate](https://donatebot.io/checkout/710008808625143828?buyer=${message.author.id})`)
            .setFooter(`Made by ${OWNER.tag}`)
        );
    }
}