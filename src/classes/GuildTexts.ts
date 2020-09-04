import Database from '../database/';

export default class GuildTexts {
    public id: string;
    constructor(guild_id: string) {
        this.id = guild_id;
    }
    async open(opts: { id: string; channel: string; }) {
        let tt: any = await Database.Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Texts.create({ guild_id: this.id });
        const sequence = tt.sequence;
        const text = Object.assign({
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            sequence,
        }, opts);
        tt.sequence++;
        if (!tt.data) tt.data = [];
        tt.data.push(text);
        await Database.Texts.update({ sequence: tt.sequence, data: tt.data }, { where: { guild_id: this.id } });
    }
    async close(id: string) {
        let tt: any = await Database.Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Texts.create({ guild_id: this.id });
        tt.data = tt.data.filter((text: Text) => text.channel !== id);
        await Database.Texts.update({ data: tt.data }, { where: { guild_id: this.id } });
    }
    async find(id: string): Promise<Text> {
        let tt: any = await Database.Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Texts.create({ guild_id: this.id });
        return tt.data.find((t: Text) => t.id === id || t.channel === id);
    }
    async list(): Promise<Text[]> {
        let tt: any = await Database.Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Texts.create({ guild_id: this.id });
        return tt.data;
    }
}

interface Text {
    id: string;
    channel: string;
    sequence: number;
    date: string;
}