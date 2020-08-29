import Client from './Unicron';

export default class Guild {
    private client: Client;
    public id: string;
    public prefix: string;
    public premium: boolean;
    public modLogChannel: string;
    public autoModeration: boolean;
    public autoModAction: string;
    public autoModDuration: number;
    public warnThreshold: number;
    public warnThresholdAction: string;
    public warnActionDuration: number;
    public welcomeChannel: string;
    public welcomeMessage: string;
    public welcomeEnabled: boolean;
    public farewellChannel: string;
    public farewellMessage: string;
    public farewellEnabled: string;
    public verificationChannel: string;
    public verificationType: string;
    public verificationRole: string;
    public verificationEnabled: boolean;
    public ticketCategory: string;
    public ticketEnabled: boolean;
    public dynamicCategory: string;
    public dynamicRoom: string;
    public dynamicEnabled: boolean;
    public inviteFilter: boolean;
    public swearFilter: boolean;
    public mentionSpamFilter: boolean;
    public data: object;
    constructor(client: Client, raw: GuildSettings) {
        this.client = client;
        this.id = raw.id;
        this.prefix = raw.prefix;
        this.modLogChannel = raw.modLogChannel;
        this.autoModeration = raw.autoModeration;
        this.autoModAction = raw.autoModAction;
        this.autoModDuration = raw.autoModDuration;
        this.warnThreshold = raw.warnThreshold;
        this.warnThresholdAction = raw.warnThresholdAction;
        this.warnActionDuration = raw.warnActionDuration;
        this.welcomeChannel = raw.welcomeChannel;
        this.welcomeMessage = raw.welcomeMessage;
        this.welcomeEnabled = raw.welcomeEnabled;
        this.farewellChannel = raw.farewellChannel;
        this.farewellMessage = raw.farewellMessage;
        this.farewellEnabled = raw.farewellEnabled;
        this.verificationChannel = raw.verificationChannel;
        this.verificationType = raw.verificationType;
        this.verificationRole = raw.verificationRole;
        this.verificationEnabled = raw.verificationEnabled;
        this.ticketCategory = raw.ticketCategory;
        this.ticketEnabled = raw.ticketEnabled;
        this.dynamicCategory = raw.dynamicCategory;
        this.dynamicRoom = raw.dynamicRoom;
        this.dynamicEnabled = raw.dynamicEnabled;
        this.inviteFilter = raw.inviteFilter;
        this.swearFilter = raw.swearFilter;
        this.mentionSpamFilter = raw.mentionSpamFilter;
        this.data = raw.data;
    }
    save(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.server.post(`/api/guild/${payload.id}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON(): GuildSettings {
        return {
            id: this.id,
            prefix: this.prefix,
            premium: this.premium,
            modLogChannel: this.modLogChannel,
            autoModeration: this.autoModeration,
            autoModAction: this.autoModAction,
            autoModDuration: this.autoModDuration,
            warnThreshold: this.warnThreshold,
            warnThresholdAction: this.warnThresholdAction,
            warnActionDuration: this.warnActionDuration,
            welcomeChannel: this.welcomeChannel,
            welcomeMessage: this.welcomeMessage,
            welcomeEnabled: this.welcomeEnabled,
            farewellChannel: this.farewellChannel,
            farewellMessage: this.farewellMessage,
            farewellEnabled: this.farewellEnabled,
            verificationChannel: this.verificationChannel,
            verificationType: this.verificationType,
            verificationRole: this.verificationRole,
            verificationEnabled: this.verificationEnabled,
            ticketCategory: this.ticketCategory,
            ticketEnabled: this.ticketEnabled,
            dynamicCategory: this.dynamicCategory,
            dynamicRoom: this.dynamicRoom,
            dynamicEnabled: this.dynamicEnabled,
            inviteFilter: this.inviteFilter,
            swearFilter: this.swearFilter,
            mentionSpamFilter: this.mentionSpamFilter,
            data: this.data,
        };
    }
}

interface GuildSettings {
    id: string;
    prefix: string;
    premium: boolean;
    modLogChannel: string;
    autoModeration: boolean;
    autoModAction: string;
    autoModDuration: number;
    warnThreshold: number;
    warnThresholdAction: string;
    warnActionDuration: number;
    welcomeChannel: string;
    welcomeMessage: string;
    welcomeEnabled: boolean;
    farewellChannel: string;
    farewellMessage: string;
    farewellEnabled: string;
    verificationChannel: string;
    verificationType: string;
    verificationRole: string;
    verificationEnabled: boolean;
    ticketCategory: string;
    ticketEnabled: boolean;
    dynamicCategory: string;
    dynamicRoom: string;
    dynamicEnabled: boolean;
    inviteFilter: boolean;
    swearFilter: boolean;
    mentionSpamFilter: boolean;
    data: object;
}