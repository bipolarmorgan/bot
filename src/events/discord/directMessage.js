const BaseEvent = require('../../classes/DiscordEvent');

module.exports = class extends BaseEvent {
    constructor() {
        super('directMessage');
        this.prefix = '**[Moderator]** : ';
    }
    /**
     * 
     * @param {import('../../classes/Unicron')} client
     * @param {import('discord.js').Message} message
     */
    async run(client, message, isMod = false) {
        if (isMod) {
            const user = client.users.cache.find((c) => c.id === message.channel.topic);
            if (!user) return message.channel.send('Message not sent');
            try {
                switch (message.content) {
                    case '!!welcome': {
                        await user.send(this.prefix + 'Hey! :wave: - Give me a minute while I review your request.');
                        break;
                    }
                    case '!!all': {
                        await user.send(this.prefix + 'Is that all you need today?');
                        break;
                    }
                    case '!!support': {
                        await user.send(this.prefix + 'Hey! This service is only intended for support! Please do not keep messaging this service.');
                        break;
                    }
                    case '!!require': {
                        await user.send(this.prefix + 'Do you require any further assistance?');
                        break;
                    }
                    case '!!close': {
                        await user.send(this.prefix + `I'm going to close this thread now. If you have any further questions, feel free to reach out`);
                        break;
                    }
                    case '!!unicron': {
                        await user.send(this.prefix + `we are not Unicron, we are a help system to help you understand something you are confused about with the Bot`);
                        break;
                    }
                    default: {
                        await user.send(this.prefix + message.content);
                        break;
                    }
                }
            } catch (e) {
                message.channel.send('Message not sent');
            }
        } else {
            const guild = client.guilds.cache.get('603558917087428618');
            let channel = guild.channels.cache.find((c) => c.topic && c.topic === message.author.id && c.parentID === '748855168308609024');
            if (!channel) {
                channel = await guild.channels.create(message.author.tag.replace(/ +|#/g, '-'), {
                    type: 'text',
                    topic: message.author.id,
                    parent: '748855168308609024',
                }).catch(() => {
                    message.channel.send('Message not sent');
                });
            }
            if (!channel) return;
            channel.send(`**${message.author.tag}** : ${message.content.replace(/@/g, '@' + String.fromCharCode(8203))}`);
        }
    }
}