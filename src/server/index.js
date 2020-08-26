const express = require('express');

/**
 * @param {import('discord.js').ShardingManager} manager
 */
module.exports = (manager) => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.get('/api/guilds', async (req, res) => {
        try {
            /**
             * @type {import('discord.js').Collection<string, import('discord.js').Guild>[]}
             */
            const guildCC = await manager.broadcastEval('this.guilds.cache');
            const guilds = [];
            guildCC.map((gc) => {
                gc.map((g) => {
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
            /**
             * @type {import('discord.js').GuildChannelManager[]}
             */
            const channelsCC = await manager.broadcastEval(`this.guilds.cache.get('${id}').channels`);
            const channels = channelsCC.find((c) => c);
            if (!channels) return res.status(404).send({ message: 'channels not found '});
            const retval = channels.cache.map((c) => {
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
            /**
             * @type {import('discord.js').RoleManager[]}
             */
            const rolesCC = await manager.broadcastEval(`this.guilds.cache.get('${id}').roles`);
            const roles = rolesCC.find((c) => c);
            if (!roles) return res.status(404).send({ message: 'roles not found '});
            const retval = roles.cache.filter((r) => !r.managed && r.name !== '@everyone').map((c) => {
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