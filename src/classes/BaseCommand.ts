export default class Command {
    public config: Config;
    public options: Options;
    public argsDefinitions: object;
    constructor(props: { config: Config; options: Options; argsDefinitions: object; }) {
        this.config = props.config;
        this.options = props.options;
        this.argsDefinitions = props.argsDefinitions;
    }
}
interface Config {
    name: string;
    description: string;
    permission: 'User' | 'Server Moderator' | 'Server Administrator' | 'Server Owner' | 'Bot Staff' | 'Bot Owner';
}
interface Options {
    aliases: string[];
    clientPermissions: 'CREATE_INSTANT_INVITE' | 'KICK_MEMBERS' | 'BAN_MEMBERS' | 'ADMINISTRATOR' | 'MANAGE_CHANNELS' | 'MANAGE_GUILD' | 'ADD_REACTIONS' | 'VIEW_AUDIT_LOG' | 'PRIORITY_SPEAKER' | 'STREAM' | 'VIEW_CHANNEL' | 'SEND_MESSAGES' | 'SEND_TTS_MESSAGES' | 'MANAGE_MESSAGES' | 'EMBED_LINKS' | 'ATTACH_FILES' | 'READ_MESSAGE_HISTORY' | 'MENTION_EVERYONE' | 'USE_EXTERNAL_EMOJIS' | 'VIEW_GUILD_INSIGHTS' | 'CONNECT' | 'SPEAK' | 'MUTE_MEMBERS' | 'DEAFEN_MEMBERS' | 'MOVE_MEMBERS' | 'USE_VAD' | 'CHANGE_NICKNAME' | 'MANAGE_NICKNAMES' | 'MANAGE_ROLES' | 'MANAGE_WEBHOOKS' | 'MANAGE_EMOJIS'[];
    cooldown: number;
    nsfwCommand: boolean;
    args: boolean;
    usage: string;
    donatorOnly: boolean;
    premiumServer: boolean
}