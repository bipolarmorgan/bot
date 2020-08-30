import Database from '../database/';

export default class GuildTickets {
    public id: string;
    constructor(guild_id: string) {
        this.id = guild_id;
    }
    async new(opts: { id: string; issue: string; channel: string; }): Promise<number> {
        let tt: any = await Database.Tickets.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Tickets.create({ guild_id: this.id });
        const index = tt.sequence;
        const ticket = Object.assign({
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            case: index,
        }, opts);
        tt.sequence++;
        if (!tt.data) tt.data = [];
        tt.data.push(ticket);
        await Database.Tickets.update({ sequence: tt.sequence, data: tt.data }, { where: { guild_id: this.id } });
        return ticket.case;
    }
    async close(id: string) {
        let tt: any = await Database.Tickets.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Tickets.create({ guild_id: this.id });
        tt.data = tt.data.filter((ticket: Ticket) => ticket.channel !== id);
        await Database.Tickets.update({ data: tt.data }, { where: { guild_id: this.id } });
    }
    async find(id: string): Promise<Ticket> {
        let tt: any = await Database.Tickets.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Tickets.create({ guild_id: this.id });
        return tt.data.find((t: Ticket) => t.id === id || t.channel === id);
    }
    async list(): Promise<Ticket[]> {
        let tt: any = await Database.Tickets.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Database.Tickets.create({ guild_id: this.id });
        return tt.data;
    }
}

interface Ticket {
    id: string;
    channel: string;
    issue: string;
    case: number;
    date: string;
}