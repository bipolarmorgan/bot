import {
    Client as DiscordClient, Collection, Guild, GuildEmoji,
    Channel, Role, Message, MessageEmbed
} from 'discord.js';

import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import Emotes from '../assets/Emotes';
import BaseCommand from './BaseCommand';
import BaseItem from './BaseItem';
import DiscordEvent from './DiscordEvent';
import WebSocketEvent from './WebSocketEvent';
import PermissionManager from '../managers/PermissionManager';
import API from '../api/';
import utils from '../utils/';

import UserManager from '../managers/UserManager';
import GuildManager from '../managers/GuildManager';
import MemberManager from '../managers/MemberManager';
import CooldownManager from '../managers/CooldownManager';

export default class Client extends DiscordClient {
    public commands: Collection<string, BaseCommand>;
    public shopitems: Collection<string, BaseItem>;
    public botEmojis: Collection<string, GuildEmoji>;
    public unicron: {
        owner: string;
        serverInviteURL: string;
        channel: string;
    }
    public utils: typeof utils;
    public logger: typeof utils.Logger;
    public wait: (ms: number) => Promise<void>;
    public server: API;
    public permission: PermissionManager;
    public db: {
        users: UserManager;
        guilds: GuildManager;
        members: MemberManager;
        cooldowns: CooldownManager;
    }
    constructor() {
        super({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
        this.commands = new Collection();
        this.shopitems = new Collection();
        this.botEmojis = new Collection();
        this.unicron = {
            owner: process.env.BOT_OWNER_ID,
            serverInviteURL: process.env.BOT_SERVER_URL,
            channel: process.env.BOT_CHANNEL_ID,
        }
        this.utils = utils;
        this.logger = this.utils.Logger;
        this.wait = promisify(setTimeout);
        this.server = new API();
        this.permission = new PermissionManager(this);
        this.db = {
            users: new UserManager(this),
            guilds: new GuildManager(this),
            members: new MemberManager(this),
            cooldowns: new CooldownManager(this),
        }
    }
    async superlogin() {
        this.server.connect();
        await this.login(process.env.DISCORD_TOKEN);
    }
    async register() {
        await this.registerItems();
        await this.registerCommands();
        await this.registerDiscordEvents();
        await this.registerWebSocketEvents();
    }
    async resolveUser(search: string) {
        if (!search || typeof search !== 'string') return null;
        let user = null;
        if (search.match(/^<@!?(\d+)>$/)) user = await this.users.fetch(search.match(/^<@!?(\d+)>$/)[1]).catch(() => { });
        if (search.match(/^!?(\w+)#(\d+)$/) && !user) user = this.users.cache.find((u) => u.username === search.match(/^!?(\w+)#(\d+)$/)[0] && u.discriminator === search.match(/^!?(\w+)#(\d+)$/)[1]);
        if (!user) user = await this.users.fetch(search).catch(() => { });
        return user;
    }
    async resolveMember(search: string, guild: Guild) {
        if (!search || typeof search !== 'string') return null;
        const user = await this.resolveUser(search);
        if (!user) return null;
        return await guild.members.fetch(user).catch(() => { });
    }
    resolveRole(search: string, guild: Guild): Role | null {
        if (!search || typeof search !== 'string') return null;
        let role = null;
        if (search.match(/^<@&!?(\d+)>$/)) role = guild.roles.cache.get(search.match(/^<@&!?(\d+)>$/)[1]);
        if (!role) role = guild.roles.cache.find((r) => r.name === search);
        if (!role) role = guild.roles.cache.get(search);
        return role;
    }
    resolveChannel(search: string, guild: Guild): Channel | null {
        if (!search || typeof search !== 'string') return null;
        let channel = null;
        if (search.match(/^<@#!?(\d+)>$/)) channel = guild.channels.cache.get(search.match(/^<@#!?(\d+)>$/)[1]);
        if (!channel) channel = guild.channels.cache.find((c) => c.name === search);
        if (!channel) channel = guild.channels.cache.get(search);
        return channel;
    }
    async getEmoji(name: string): Promise<GuildEmoji> {
        if (this.emojis.cache.has(Emotes.get(name))) return this.emojis.cache.get(Emotes.get(name));
        if (this.botEmojis.has(name)) return this.botEmojis.get(name);
        function findEmoji(id: string) {
            const temp = this.emojis.cache.get(id);
            if (!temp) return null;
            const emoji = Object.assign({}, temp);
            if (emoji.guild) emoji.guild = emoji.guild.id;
            emoji.require_colons = emoji.requiresColons;
            return emoji;
        }
        return new Promise(async (resolve) => {
            return resolve(
                await this.shard.broadcastEval(`(${findEmoji}).call(this, '${Emotes.get(name)}')`)
                    .then((arr: any) => {
                        const femoji = arr.find((emoji: any) => emoji);
                        if (!femoji) return null;
                        const client: any = this;
                        return client.api.guilds(femoji.guild)
                            .get()
                            .then((raw: any) => {
                                const guild = new Guild(this, raw);
                                const emoji = new GuildEmoji(this, femoji, guild);
                                this.botEmojis.set(name, emoji);
                                return emoji;
                            });
                    })
            );
        });
    }
    async awaitReply(message: Message, question: string | MessageEmbed, limit: number = 60000, obj: boolean = false): Promise<boolean | string | Message> {
        const filter = (m: Message) => m.author.id === message.author.id;
        await message.channel.send(question);
        try {
            const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
            if (obj) return collected.first();
            return collected.first().content;
        } catch (e) {
            return false;
        }
    }
    private registerItem(dir: string): boolean | string {
        try {
            const Item = require(dir);
            if (Item.default.prototype instanceof BaseItem) {
                const props = new Item.default();
                this.shopitems.set(props.config.id, props);
            }
            return false;
        } catch (e) {
            return `Unable to load item ${dir}: ${e}`;
        }
    }
    private async registerItems() {
        const filePath = path.join(__dirname, '../items/');
        const files = await fs.readdir(filePath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const response = this.registerItem(path.join(filePath, file));
                if (response) this.logger.error(response);
            }
        }
    }
    private registerCommand(dir: string, category: string): string | boolean {
        try {
            const Command = require(dir);
            if (Command.default.prototype instanceof BaseCommand) {
                const props = new Command.default();
                props.config.category = category;
                this.commands.set(props.config.name, props);
            }
            return false;
        } catch (e) {
            return `Unable to load command ${dir}: ${e}`;
        }
    }
    private async registerCommands() {
        const filePath = path.join(__dirname, '../commands/');
        const files = await fs.readdir(filePath);
        for (const file of files) {
            const filesPath = path.join(filePath, file);
            const commands = await fs.readdir(filesPath);
            for (const command of commands) {
                if (command.endsWith('.js')) {
                    const response = this.registerCommand(path.join(filesPath, command), file);
                    if (response) this.logger.error(response);
                }
            }
        }
    }
    private async registerWebSocketEvents() {
        const filePath = path.join(__dirname, '../events/websocket/');
        const files = await fs.readdir(filePath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const Event = require(path.join(filePath, file));
                if (Event.default.prototype instanceof WebSocketEvent) {
                    const instance = new Event.default();
                    this.server.on(instance.eventName, instance.run.bind(instance, this));
                }
                delete require.cache[require.resolve(path.join(filePath, file))];
            }
        }
    }
    private async registerDiscordEvents() {
        const filePath = path.join(__dirname, '../events/discord/');
        const files = await fs.readdir(filePath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const Event = require(path.join(filePath, file));
                if (Event.default.prototype instanceof DiscordEvent) {
                    const instance = new Event.default();
                    this.on(instance.eventName, instance.run.bind(instance, this));
                }
                delete require.cache[require.resolve(path.join(filePath, file))];
            }
        }
    }
    async getCount(props: 'users' | 'guilds'): Promise<number> {
        if (props === 'users') {
            const raw = await this.shard.broadcastEval(`this.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0)`);
            return raw.reduce((acc, cur) => acc + cur, 0);
        } else if (props === 'guilds') {
            const raw = await this.shard.broadcastEval(`this.guilds.cache.size`);
            return raw.reduce((acc, cur) => acc + cur, 0);
        } return 0;
    }
    trimArray(arr: Array<any>, maxLen: number = 10): any[] {
        if (arr.length > maxLen) {
            arr = arr.slice(0, maxLen);
            arr.push(`${arr.length - maxLen} more...`);
        }
        return arr;
    }
    shorten(text: string, maxLen: number = 2000) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }
    formatNumber(n: number, minimumFractionDigits: number = 0) {
        return Number.parseFloat(n.toString()).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2
        });
    }
    base64(text: string, mode: 'encode' | 'decode' = 'encode') {
        if (mode === 'encode') return Buffer.from(text).toString('base64');
        if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
        return null;
    }
    embedURL(title: string, url: string, display: string) {
        return `[${title}](${url.replace(/\)/g, '%27')}${display ? ` '${display}'` : ''})`;
    }
    hash(text: string, algorithm: 'sha256' | 'md5' | 'sha1' | 'sha512') {
        return crypto.createHash(algorithm).update(text).digest('hex');
    }
    escapeRegex(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    chunk<T>(array: Array<T>, chunkSize: number = 0): Array<Array<T>> {
        return array.reduce((previous, current) => {
            let chunk: any[] = [];
            if (previous.length === 0 || previous[previous.length - 1].length === chunkSize) {
                chunk = [];
                previous.push(chunk);
            } else {
                chunk = previous[previous.length - 1];
            }
            chunk.push(current);
            return previous;
        }, []);
    }
    shuffle(obj: string | any[]): any {
        if (!obj) return null;
        if (Array.isArray(obj)) {
            let i = obj.length;
            while (i) {
                let j = Math.floor(Math.random() * i);
                let t = obj[--i];
                obj[i] = obj[j];
                obj[j] = t;
            }
            return obj;
        }
        if (typeof obj === 'string') return this.shuffle(obj.split('')).join('');
        return obj;
    }
}