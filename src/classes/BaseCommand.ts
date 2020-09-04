import Client from "./Unicron";
import { Message, PermissionString } from "discord.js";
import Guild from "./Guild";
import User from "./User";
import { ParsedArgs } from "minimist";

export default class Command {
    public config: Config;
    public options: Options;
    public argsDefinitions?: object;
    constructor(props: { config: Config; options: Options; argsDefinitions?: object; }) {
        this.config = props.config;
        this.options = props.options;
        this.argsDefinitions = props.argsDefinitions;
    }
    async run(client: Client, message: Message, args: string[] | ParsedArgs, guildSettings: Guild, userStats: User): Promise<any> {}
}
export interface Config {
    name: string;
    description: string;
    permission: 'User' | 'Server Moderator' | 'Server Administrator' | 'Server Owner' | 'Bot Staff' | 'Bot Owner';
    category?: string;
}
export interface Options {
    aliases?: string[];
    clientPermissions?: PermissionString[];
    cooldown?: number;
    nsfwCommand?: boolean;
    args?: boolean;
    usage?: string;
    donatorOnly?: boolean;
    premiumServer?: boolean
}