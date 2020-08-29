import { Collection } from 'discord.js';
import Client from './Unicron';

export default class BaseManager<T> {
    protected client: Client;
    public cache: Collection<string, T>;
    constructor(client: Client) {
        this.client = client;
        this.cache = new Collection();
    }
}