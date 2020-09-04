import Client from './Unicron';
import Leveling from '../modules/Leveling';
import { MessageEmbed, Message } from 'discord.js';

export default class User {
    private client: Client;
    public id: string;
    public balance: number;
    public experience: number;
    public multiplier: number;
    public marriage_id: string;
    public inventory: {
        item_id: string;
        amount: number;
    }[];
    public data: {
        badges: string[];
        premium: boolean;
    }
    constructor(client: Client, raw: UserData) {
        this.client = client;
        this.id = raw.id;
        this.balance = raw.balance;
        this.experience = raw.experience;
        this.multiplier = raw.multiplier;
        this.marriage_id = raw.marriage_id;
        this.inventory = raw.inventory;
        this.data = raw.data;
    }
    get level(): number {
        let lvl = 0;
        const cur = this.experience;
        for (let i = 0; i < 101; i++) {
            lvl = i;
            if (cur >= Leveling.LevelChart[i] && cur <= Leveling.LevelChart[i + 1]) break;
        }
        return lvl;
    }
    get levelxp(): number {
        return Leveling.LevelChart[this.level];
    }
    get nextlevel(): number {
        return this.level + 1;
    }
    get nextlevelxp(): number {
        return Leveling.LevelChart[this.nextlevel];
    }
    get progress(): number {
        return ((this.experience - this.levelxp) / (this.nextlevelxp - this.levelxp)) * 100; // (xp - lxp / nxp - lxp) * 100 = n
    }
    get progressbar(): string {
        return Leveling.ProgressBar(this.progress);
    }
    get progressXP(): number {
        return this.nextlevelxp - this.experience;
    }
    async addXP(message: Message, amount?: number): Promise<void> {
        const next_level = this.nextlevel;
        let current_level = this.level;
        this.experience += amount || this.client.utils.Random.nextInt({ max: 25, min: 15 });
        current_level = this.level;
        if (current_level === next_level) {
            const prize = Leveling.RequiredLevelChart[current_level] * 2;
            this.balance += prize;
            await this.save().catch((e) => { throw e; });
            await message.channel.send(new MessageEmbed()
                .setColor('0x00FFFF')
                .setTitle(':arrow_up:   **LEVELUP**   :arrow_up:')
                .setDescription(`GG, You levelup from **${current_level - 1}** ${await this.client.getEmoji('join_arrow')} **${current_level}**\nAnd received **${prize}**💰 coins!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
        }
    }
    addItem(item: string): number | void {
        const cur = this.inventory.find((t) => t.item_id === item);
        if (cur) return cur.amount++;
        this.inventory.push({ item_id: item, amount: 1 });
    }
    removeItem(item: string): number | void {
        const cur = this.inventory.find((t) => t.item_id === item);
        if (cur && cur.amount > 1) return cur.amount--;
        this.inventory = this.inventory.filter((t) => t.item_id !== item);
    }
    hasItem(item: string): boolean {
        return !!this.inventory.find((t) => t.item_id === item);
    }
    addBadge(badge: string): void {
        if (!this.data) this.data = { badges: [], premium: false };
        if (!this.data.badges) this.data.badges = [];
        if (!this.data.badges.includes(badge)) this.data.badges.push(badge);
    }
    removeBadge(badge: string): void {
        if (!this.data) this.data = { badges: [], premium: false };
        if (!this.data.badges) this.data.badges = [];
        if (this.data.badges.includes(badge)) this.data.badges = this.data.badges.filter((b) => b !== badge);
    }
    hasBadge(badge: string): boolean {
        if (!this.data) this.data = { badges: [], premium: false };
        if (!this.data.badges) this.data.badges = [];
        return this.data.badges.includes(badge);
    }
    save(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.server.post(`/api/user/${payload.id}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON(): UserData {
        return {
            id: this.id,
            balance: this.balance,
            experience: this.experience,
            multiplier: this.multiplier,
            marriage_id: this.marriage_id,
            inventory: this.inventory,
            data: this.data,
        }
    }
}

export interface UserData {
    id: string;
    balance: number;
    experience: number;
    multiplier: number;
    marriage_id: string;
    inventory: {
        item_id: string;
        amount: number;
    }[];
    data: {
        badges: string[];
        premium: boolean;
    }
}