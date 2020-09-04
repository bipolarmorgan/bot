import Client from './Unicron';
import { Message } from 'discord.js';
import User from './User';

export default class Item {
    public config: Config;
    public options: Options;
    constructor(props: { config: Config; options: Options }) {
        this.config = props.config;
        this.options = props.options;
    }
    async run(client: Client, message: Message, stats: User): Promise<any> { };
}
interface Config {
    id: string;
    displayname: string;
    description: string;
}
interface Options {
    buyable: boolean;
    sellable: boolean;
    usable: boolean;
    price: number;
    cost: number;
}