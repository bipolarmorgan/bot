const { Texts } = require('../database/');

class GuildTexts {
    constructor(guild_id) {
        this.id = guild_id;
    }
    /**
     * 
     * @param {{id:string,channel:string}} opts 
     */
    async open(opts) {
        let tt = await Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Texts.create({ guild_id: this.id });
        const sequence = tt.sequence;
        const text = Object.assign({
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            sequence,
        }, opts);
        tt.sequence++;
        if (!tt.data) tt.data = [];
        tt.data.push(text);
        await Texts.update({ sequence: tt.sequence, data: tt.data }, { where: { guild_id: this.id } });
    }
    /**
     * 
     * @param {string} id 
     */
    async close(id) {
        let tt = await Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Texts.create({ guild_id: this.id });
        await Texts.update({ data: tt.data.filter((text) => text.id !== id) }, { where: { guild_id: this.id } });
    }
    /**
     * @returns {Promise<{id:string,channel:string,sequence:number,date:string}>}
     * @param {string} id 
     */
    async find(id) {
        let tt = await Texts.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Texts.create({ guild_id: this.id });
        return tt.data.find((t) => t.id === id || t.channel === id);
    }
    /**
     * @returns {Promise<{id:string,channel:string,sequence:number,date:string}[]>}
     */
    async list() {
        let tt = await Tickets.findOne({ where: { guild_id: this.id } });
        if (!tt) tt = await Tickets.create({ guild_id: this.id });
        return tt.data;
    }
}

module.exports = GuildTexts;