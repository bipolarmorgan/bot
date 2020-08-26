const { Sequelize, Transaction } = require('sequelize');

const db = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './database/db.sqlite',
    transactionType: Transaction.TYPES.IMMEDIATE,
    retry: {
        max: 10,
    }
});

const cd = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './database/Cooldowns.sqlite',
    transactionType: Transaction.TYPES.IMMEDIATE,
    retry: {
        max: 10,
    }
});

const Tickets = require('./models/Tickets')(db);
const Texts = require('./models/Texts')(db);
const Cooldowns = require('./models/Cooldowns')(cd);

(async function(){
    if (process.argv.includes('--dbInit')) {
        await db.sync({ force: true }).then(() => {
            console.log('Local database dropped!');
        }).catch(console.error);
        await cd.sync({ force: true }).then(() => {
            console.log('Cooldown database dropped!');
        }).catch(console.error);
    } else {
        await db.authenticate().then(() => {
            console.log('Local database connection established!');
        }).catch(console.error);
        await cd.authenticate().then(() => {
            console.log('Cooldown database connection established!');
        }).catch(console.error);
    }
})();

module.exports = { Tickets, Texts, Cooldowns };