const BaseManager = require('../classes/BaseManager');

const Levels = [
    {
        name: 'User',
        level: 1,
        check: function () {
            return true;
        }
    }, {
        name: 'Server Moderator',
        level: 2,
        check: function (client, message) {
            return message.member.permissions.has(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES']);
        }
    }, {
        name: 'Server Administrator',
        level: 3,
        check: function (client, message) {
            return message.member.permissions.has(['MANAGE_GUILD']);
        }
    }, {
        name: 'Server Owner',
        level: 4,
        check: function (client, message) {
            return message.author.id === message.guild.ownerID;
        }
    }, {
        name: 'Bot Owner',
        level: 10,
        check: function (client, message) {
            return client.unicron.owner === message.author.id;
        }
    },
]

class PermissionManager extends BaseManager {
    constructor(client) {
        super(client);
        this.levels = [];
        for (const l of Levels) {
            this.cache.set(l.name, l);
            this.levels[l.level] = l.name;
        }
        /**
         * @type {import('discord.js').Collection<string, typeof Levels[0]}
         */
        this.cache;
    }
    /**
     * @returns {number}
     * @param {import('discord.js').Message} message 
     */
    level(message) {
        let num = 0;
        for (const level of Levels) {
            num = level.check(this.client, message) ? level.level : num;
        }
        return num;
    }
}

module.exports = PermissionManager;