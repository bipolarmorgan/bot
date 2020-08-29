import Client from './Unicron';
import { User } from 'discord.js';

export default class Member {
    private client: Client;
    public guild_id: string;
    public member_id: string;
    public data: MemberData;
    constructor(client: Client, raw: MemberDataS) {
        this.client = client;
        this.guild_id = raw.guild_id;
        this.member_id = raw.member.id;
        this.data = raw.member.data;
    }
    addWarn(reason: string, moderator: User): number {
        if (!this.data) this.data = { captcha: null, warnings: [], cases: 1 };
        if (!this.data.warnings) this.data.warnings = [];
        if (!this.data.cases) this.data.cases = 1;
        const index = this.data.cases;
        this.data.warnings.push({
            reason,
            moderator: `${moderator.tag} / ${moderator.id}`,
            case: index,
            date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        });
        this.data.cases++;
        return index;
    }
    removeWarn(index: number): void {
        this.data.warnings = this.data.warnings.filter((w) => w.case !== index);
    }
    save(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const payload = this.toJSON();
            await this.client.server.post(`/api/member/${payload.guild_id}/${payload.member_id}`, payload).catch(reject);
            resolve();
        });
    }
    toJSON(): MemberDataD {
        return {
            guild_id: this.guild_id,
            member_id: this.member_id,
            data: this.data,
        }
    }
}

interface MemberData {
    captcha: string;
    cases: number;
    warnings: {
        case: number;
        reason: string;
        moderator: string;
        date: string;
    }[];
}

interface MemberDataS {
    guild_id: string;
    member: {
        id: string;
        data: MemberData;
    }
}

interface MemberDataD {
    guild_id: string;
    member_id: string;
    data: MemberData;
}