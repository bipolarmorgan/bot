require('dotenv').config();

const Unicron = require('./classes/Unicron');
const client = new Unicron();

(async function () {
    await client.register();
    await client.superlogin();
})();