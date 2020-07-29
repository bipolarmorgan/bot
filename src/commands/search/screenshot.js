const BaseCommand = require('../../classes/BaseCommand');
const fetch = require('node-fetch');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'screenshot',
                description: 'Takes a screenshot of any webpage.',
                permission: 'User',
            },
            options: {
                aliases: ['capture', 'snap'],
                clientPermissions: ['ATTACH_FILES'],
                cooldown: 10,
                nsfwCommand: true,
                args: true,
                usage: 'screenshot <URL>',
                donatorOnly: false,
                premiumServer: false,
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
        const urls = args[0];
        const site = /^(https?:\/\/)/i.test(urls) ? urls : `http://${urls}`;
        try {
            const { body } = await fetch(`https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`);
            return message.channel.send(`Snapy Snappy Screenie Sreenie web web site`, { files: [{ attachment: body, name: 'screenshot.png' }] });
        } catch (err) {
            if (err.status === 404) return message.channel.send('Could not find any results. Invalid URL?');
            return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}