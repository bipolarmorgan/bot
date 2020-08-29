import { config } from 'dotenv';
config();

import Unicron from './classes/Unicron';
const client = new Unicron();

(async function () {
    await client.register();
    await client.superlogin();
})();