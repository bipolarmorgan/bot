import express from 'express';
import { ShardingManager, Guild, Collection, ChannelManager, RoleManager, GuildChannel } from 'discord.js';

interface Channel {
    id: string;
    name: string;
    type: string;
}

interface Role {
    id: string;
    name: string;
}

export default function (manager: ShardingManager) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.get('/api/guilds', async (req, res) => {
        try {
            const guildCC: Collection<string, Guild>[] = await manager.broadcastEval('this.guilds.cache');
            const guilds: string[] = [];
            guildCC.map((gc: Collection<string, Guild>) => {
                gc.map((g: Guild) => {
                    guilds.push(g.id);
                });
            })
            res.status(200).json(guilds);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    });
    app.get('/api/guild/:id/channels', async (req, res) => {
        try {
            const id = req.params.id;
            const channelsCC: ChannelManager[] = await manager.broadcastEval(`this.guilds.cache.get('${id}').channels`);
            const channels = channelsCC.find((c) => c);
            if (!channels) return res.status(404).send({ message: 'channels not found' });
            const retval: Channel[] = channels.cache.map((c: GuildChannel) => {
                return {
                    id: c.id,
                    name: c.name,
                    type: c.type,
                }
            });
            res.status(200).json(retval);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    });
    app.get('/api/guild/:id/roles', async (req, res) => {
        try {
            const id = req.params.id;
            const rolesCC: RoleManager[] = await manager.broadcastEval(`this.guilds.cache.get('${id}').roles`);
            const roles = rolesCC.find((c) => c);
            if (!roles) return res.status(404).send({ message: 'roles not found ' });
            const retval: Role[] = roles.cache.filter((r: any) => !r.managed && r.name !== '@everyone').map((c) => {
                return {
                    id: c.id,
                    name: c.name,
                }
            });
            res.status(200).json(retval);
        } catch (e) {
            console.log(e);
            res.status(500).json(e);
        }
    });
    app.listen(4202, () => {
        console.log('API Server Running on PORT 4202');
    });
}