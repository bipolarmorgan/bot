const Endpoint = require('../classes/Endpoint');
const { Permissions } = require('discord.js');

class Webhook extends Endpoint {
    constructor(app) {
        super('/dashboard', app);
    }
    createRoute() {
        this.route.use(this.client.Authentication);
        this.route.get('/', (req, res) => {
            const guilds = req.user.guilds.filter((g) => {
                const permissions = new Permissions(g.permissions);
                return permissions.has('MANAGE_GUILD');
            });
            this.client.renderTemplate(req, res, 'dashboard.ejs', { guilds });
        });
        this.route.get('/manage/:id', async (req, res) => {
            if (!req.params.id) return res.redirect('/dashboard');
            const tmp = req.user.guilds.find((g) => g.id === req.params.id);
            if (!tmp) return res.redirect('/404');
            const guild = await this.client.fetchGuild(tmp.id);
            if (!guild) return res.redirect('/invite');
        });
        return this.route;
    }
}

module.exports = Webhook;