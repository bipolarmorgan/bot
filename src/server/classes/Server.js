const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const { promisify } = require('util');
const BaseEvent = require('../../classes/BaseEvent');
const Endpoint = require('./Endpoint');
const EventEmitter = require('events').EventEmitter;
const { ShardingManager, User, Guild } = require('discord.js');
const GuildManager = require('../../managers/GuildManager');
const UserManager = require('../../managers/UserManager');
const POSTManager = require('../../managers/POSTManager');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const { Strategy } = require('passport-discord');
const helmet = require('helmet');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4200/callback',
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
}));




module.exports = class Server extends EventEmitter {
    /**
     * 
     * @param {ShardingManager} manager 
     */
    constructor(manager) {
        super();
        this.manager = manager;
        this.utils = require('../../utils/');
        this.logger = this.utils.Logger;
        this.wait = promisify(setTimeout);
        this.database = {
            users: new UserManager(this, {}),
            guilds: new GuildManager(this, {}),
        }
        this.poster = new POSTManager(this, {});
    }
    /**
     * @returns {Promise<number>}
     * @param {"users"|"guilds"} props 
     */
    async getCount(props) {
        if (props === 'users') {
            const raw = await this.manager.broadcastEval(`this.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0)`);
            return raw.reduce((acc, cur) => acc + cur, 0);
        } else if (props === 'guilds') {
            const raw = await this.manager.broadcastEval(`this.guilds.cache.size`);
            return raw.reduce((acc, cur) => acc + cur, 0);
        } return 0;
    }
    /**
     * @returns {Promise<User>}
     * @param {string} user_id 
     */
    fetchUser(user_id) {
        return new Promise(async (resolve, reject) => {
            const fetched = await this.manager.broadcastEval(`
                (async () => {
                    if (this.shard.id === 0) {  
                        const user = await this.users.fetch('${user_id}').catch(() => { });
                        return user;
                    }
                    return null;
                })();
            `);
            const user = fetched.find(u => u);
            return resolve(user ? user : null);
        });
    }
    /**
     * @returns {Promise<Guild>}
     * @param {string} guild_id 
     */
    fetchGuild(guild_id) {
        return new Promise(async (resolve, reject) => {
            const fetched = await this.manager.broadcastEval(`
                this.guilds.cache.get('${guild_id}');
            `);
            const guild = fetched.find(u => u);
            return resolve(guild ? guild : null);
        });
    }
    /**
     * @brief Register stufss
     * @param {string} path 
     */
    async register() {
        this.app = express();
        this.app.use(session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        }));
        this.app.locals.domain = process.env.DOMAIN;
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(helmet());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        await this.registerRoutes('../routes');
        await this.registerEvents('../events');
    }
    /**
     * @private
     * @param {string} dir 
     */
    async registerRoutes(dir) {
        this.app.get('/', (req, res) => {
            this.renderTemplate(req, res, 'index.ejs');
        });
        this.app.get('/403', (req, res) => {
            this.renderTemplate(req, res, '403.ejs');
        });
        this.app.get('/404', (req, res) => {
            this.renderTemplate(req, res, '404.ejs');
        });
        this.app.get('/500', (req, res) => {
            this.renderTemplate(req, res, '500.ejs');
        });
        this.app.get('/callback', passport.authenticate('discord', { failureRedirect: '/500' }), (req, res) => {
            res.redirect('/');
        });
        this.app.get('/login', (req, res, next) => {
            next();
        }, passport.authenticate('discord', { failureRedirect: '/500' }));
        this.app.get('/logout', function (req, res) {
            req.session.destroy(() => {
                req.logout();
                res.redirect('/');
            });
        });
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for await (const file of files) {
            if (file.endsWith('.js')) {
                const endpoint = require(path.join(filePath, file));
                if (endpoint.prototype instanceof Endpoint) {
                    const instance = new endpoint(this);
                    this.app.use(instance.url, instance.createRoute());
                    continue;
                }
            }
        }
        this.app.use((req, res) => {
            res.redirect(404, '/404');
        });
    }
    /**
     * 
     * @param {express.request} req 
     * @param {express.response} res 
     * @param {string} template 
     * @param {Object<string, any>} data 
     */
    renderTemplate(req, res, template, data = {}) {
        const baseData = {
            path: req.path,
            user: req.isAuthenticated() ? req.user : null
        };
        res.render(template, Object.assign(baseData, data));
    }
    /**
     * 
     * @param {string} dir 
     */
    async registerEvents(dir) {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const Event = require(path.join(filePath, file));
                if (Event.prototype instanceof BaseEvent) {
                    const instance = new Event();
                    this.on(instance.eventName, instance.run.bind(instance, this));
                }
                delete require.cache[require.resolve(path.join(filePath, file))];
            }
        }
    }
    /**
     * 
     * @param {number} [port=4200]
     */
    login(port = 4200) {
        return new Promise(async (resolve, reject) => {
            try {
                this.port = port || 4200;
                this.app.listen(port, () => {
                    this.logger.info(`API Server Running on port ${this.port}`);
                });
                await this.wait(20000);
                const ids = await this.manager.broadcastEval(`this.user.id`);
                this.id = ids.shift();
                this.poster.startInterval();
                return resolve(port);
            } catch (e) {
                reject(e);
            }
        });
    }
}