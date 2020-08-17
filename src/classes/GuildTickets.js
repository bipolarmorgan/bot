const { Tickets } = require('../database/');

class GuildTickets {
    constructor(guild_id) {
        this.id = guild_id;
    }
    /**
     * @returns {Promise<number>}
     * @param {{id:string,issue:string,channel:string}} opts
     */
    async new(opts) {
        let tt = await Tickets.findOne({ where: { guild_id: this.id }});
        if (!tt) tt = await Tickets.create({ guild_id: this.id });
        const index = tt.sequence;
        const ticket = Object.assign({
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            case: index,
        }, opts);
        tt.sequence++;
        tt.data.push(ticket);
        await tt.save();
        return ticket.case;
    }
    /**
     * 
     * @param {string} id 
     */
    async close(id) {
        let tt = await Tickets.findOne({ where: { guild_id: this.id }});
        if (!tt) tt = await Tickets.create({ guild_id: this.id });
        tt.data = tt.data.filter((ticket) => ticket.id !== id);
        return tt.save();
    }
    /**
     * @returns {Promise<{id:string,issue:string,channel:string,case:number,date:string}>}
     * @param {string} id 
     */
    async find(id){
        let tt = await Tickets.findOne({ where: { guild_id: this.id }});
        if (!tt) tt = await Tickets.create({ guild_id: this.id });
        return tt.data.includes({id}) ? tt.data.find((t) => t.id === id) : null;
    }
    /**
     * @returns {Promise<{id:string,issue:string,channel:string,case:number,date:string}[]>}
     */
    async list() {
        let tt = await Tickets.findOne({ where: { guild_id: this.id }});
        if (!tt) tt = await Tickets.create({ guild_id: this.id });
        return tt.data;
    }
}

module.exports = GuildTickets;