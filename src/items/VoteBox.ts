import Item from "../classes/BaseItem";
import Client from "../classes/Unicron";
import { Message } from "discord.js";
import User from "../classes/User";

export default class VoteBox extends Item {
    private prizes: {
        id: string;
        amount: number;
    }[]
    constructor() {
        super({
            config: {
                id: 'votebox',
                displayname: '🗃️ Vote Box',
                description: 'Get this item by voting!',
            },
            options: {
                buyable: false,
                sellable: true,
                usable: true,
                price: 4000,
                cost: 1000,
            }
        });
        this.prizes = [
            {
                id: 'bread',
                amount: 12,
            }, {
                id: 'apple',
                amount: 14,
            }, {
                id: 'pancake',
                amount: 8,
            }, {
                id: 'cookie',
                amount: 10,
            }, {
                id: 'bow',
                amount: 1,
            }, {
                id: 'dagger',
                amount: 1,
            }, {
                id: 'badges',
                amount: 1,
            }, {
                id: 'padlock',
                amount: 1,
            },
        ];
    }
    async run(client: Client, message: Message, stats: User) {
        const coins = client.utils.Random.nextInt({ max: 3000, min: 1000 });
        const msg = await message.channel.send('Rolling the Vote Box...');
        const theItem = this.prizes[Math.floor(Math.random() * this.prizes.length)];
        let content = ``;
        await client.wait(1500);
        this.prizes = client.shuffle(this.prizes);
        for (let i = 0; i < this.prizes.length; i++) {
            content = '';
            const prev = this.prizes[i - 1] ? this.prizes[i - 1] : this.prizes[this.prizes.length - 1];
            const item = this.prizes[i];
            const next = this.prizes[i + 1] ? this.prizes[i + 1] : this.prizes[0];
            if (prev) content += `.\n\t${client.shopitems.get(prev.id).config.displayname}\n`;
            content += `-> [${client.shopitems.get(item.id).config.displayname}] <-\n\t`;
            if (next) content += `${client.shopitems.get(next.id).config.displayname} -\n\t`;
            await msg.edit(content);
            await client.wait(1000);
        }
        await msg.edit(content.replace(/\[.*?\]/g, `[${client.shopitems.get(theItem.id).config.displayname}]`));
        await client.wait(3000);
        for (let i = 0; i < theItem.amount; i++) {
            stats.addItem(theItem.id);
        }
        stats.balance += coins;
        stats.removeItem(this.config.id);
        await stats.addXP(message, 130).catch((e) => { throw e; });
        await stats.save().catch((e) => { throw e; });
        msg.edit(`:tada: You have received :tada:\n- **${coins}** Coins 💰\n- **${theItem.amount}** ${client.shopitems.get(theItem.id).config.displayname}`);
    }
}