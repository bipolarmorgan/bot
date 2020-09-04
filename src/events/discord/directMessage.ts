import DiscordEvent from "../../classes/DiscordEvent";
import Client from "../../classes/Unicron";
import { Message, TextChannel } from "discord.js";

export default class directMessage extends DiscordEvent {
    private prefix: (tag: string) => string;
    constructor() {
        super('directMessage');
        this.prefix = (tag) => `**Moderator** | ${tag} : `;
    }
    async run(client: Client, message: Message, isMod: boolean = false) {
        if (isMod) {
            if (message.channel.type !== 'text') return;
            const user = await client.users.fetch(message.channel.topic).catch(() => { });
            if (!user) return message.channel.send('Message not sent');
            try {
                switch (message.content) {
                    case '!!welcome': {
                        await user.send(this.prefix(message.author.tag) + 'Hey! :wave: - Give me a minute while I review your request.');
                        break;
                    }
                    case '!!all': {
                        await user.send(this.prefix(message.author.tag) + 'Is that all you need today?');
                        break;
                    }
                    case '!!support': {
                        await user.send(this.prefix(message.author.tag) + 'Hey! This service is only intended for support! Please do not keep messaging this service.');
                        break;
                    }
                    case '!!require': {
                        await user.send(this.prefix(message.author.tag) + 'Do you require any further assistance?');
                        break;
                    }
                    case '!!close': {
                        await user.send(this.prefix(message.author.tag) + `I'm going to close this thread now. If you have any further questions, feel free to reach out`);
                        await message.channel.delete().catch(() => { });
                        break;
                    }
                    case '!!invite': {
                        await user.send(`Invite the bot using https://unicron-bot.xyz/invite !`);
                        break;
                    }
                    case '!!website': {
                        await user.send(`Unicron's Official Website https://unicron-bot.xyz/ !`);
                        break;
                    }
                    case '!!unicron': {
                        await user.send(this.prefix(message.author.tag) + `we are not Unicron, we are a help system to help you understand something you are confused about with the Bot`);
                        break;
                    }
                    default: {
                        const hasAttachments = message.attachments.size ? true : false;
                        await user.send(this.prefix(message.author.tag) + message.content, hasAttachments ? message.attachments.array() : {});
                        break;
                    }
                }
            } catch (e) {
                message.channel.send('Message not sent');
            }
        } else {
            const guild = await client.guilds.fetch('603558917087428618').catch(() => { });
            if (!guild) return;
            let channel: any = guild.channels.cache.find((c: TextChannel) => {
                if (c.type === 'text') {
                    if (c.topic === message.author.id) {
                        if (c.parentID === '748855168308609024') {
                            return true;
                        }
                    }
                }
                return false;
            });
            if (!channel) {
                channel = await guild.channels.create(message.author.tag.replace(/ +|#/g, '-'), {
                    type: 'text',
                    topic: message.author.id,
                    parent: '748855168308609024',
                }).catch(() => {
                    message.channel.send('Message not sent');
                });
            }
            if (!channel || channel.type !== 'text') return;
            const hasAttachments = message.attachments.size ? true : false;
            channel.send(`**User** | ${message.author.tag} : ${message.content.replace(/@/g, '@' + String.fromCharCode(8203))}`, hasAttachments ? message.attachments.array() : {});
        }
    }
}