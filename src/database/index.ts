import { Sequelize, Transaction } from 'sequelize';
import tickets from './models/Tickets';
import texts from './models/Texts';
import cooldowns from './models/Cooldowns';

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

const Tickets = tickets(db);
const Texts = texts(db);
const Cooldowns = cooldowns(cd);

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

export default { 
    Tickets,
    Texts,
    Cooldowns
};