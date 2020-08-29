import { Message } from 'discord.js';
import BaseManager from '../classes/BaseManager';
import Client from '../classes/Unicron';

interface Level {
    name: string;
    level: number;
    check: (client: Client, message: Message) => boolean;
}

const Levels = [
    {
        name: 'User',
        level: 1,
        check: () => true,
    }, {
        name: 'Server Moderator',
        level: 2,
        check: function (client: Client, message: Message) {
            return message.member.permissions.has(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES']);
        }
    }, {
        name: 'Server Administrator',
        level: 3,
        check: function (client: Client, message: Message) {
            return message.member.permissions.has(['MANAGE_GUILD']) || message.member.permissions.has(['ADMINISTRATOR']);
        }
    }, {
        name: 'Server Owner',
        level: 4,
        check: function (client: Client, message: Message) {
            return message.author.id === message.guild.ownerID;
        }
    }, {
        name: 'Bot Moderator',
        level: 8,
        check: function (client: Client, message: Message) {
            return false;
        }
    }, {
        name: 'Bot Owner',
        level: 10,
        check: function (client: Client, message: Message) {
            return client.unicron.owner === message.author.id;
        }
    },
]

export default class PermissionManager extends BaseManager<Level> {
    public levels: string[];
    constructor(client: Client) {
        super(client);
        this.levels = [];
        for (const l of Levels) {
            this.cache.set(l.name, l);
            this.levels[l.level] = l.name;
        }
    }
    level(message: Message): number {
        let num = 0;
        for (const level of Levels) num = level.check(this.client, message) ? level.level : num;
        return num;
    }
}