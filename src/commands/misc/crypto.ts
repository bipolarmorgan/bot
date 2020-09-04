import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import Util from 'util';
import fetch from 'node-fetch';

export default class Crypto extends Command {
    constructor() {
        super({
            config: {
                name: 'crypto',
                description: 'Get latest crypto exchange price in USD, or in other cryptos.',
                permission: 'User',
            },
            options: {
                aliases: [],
                clientPermissions: [],
                cooldown: 3,
                nsfwCommand: false,
                args: true,
                usage: 'crypto <...Coin Symbols>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    CrytpoComparePrice(fsym: string, tsyms: string[], message: Message) {
        fetch(`https://min-api.cryptocompare.com/data/price?fsym=${fsym}&tsyms=${tsyms}`).then(async (response) => {
            let finalMessage = '**~~------~~** __Current exchange rates for 1 ' + fsym + '__ **~~------~~**\n```c++\n';
            try {
                let responseBody = await response.json();
                for (let sym = 0; sym < tsyms.length; sym++) {
                    let price = responseBody[tsyms[sym]];
                    if (price === undefined) price = '¯\\_(ツ)_/¯'; // Not valid crypto currency ¯\_(ツ)_/¯
                    if (tsyms[sym] === 'USD') price = '$' + price;
                    finalMessage += Util.format('%s %s\n', this.pad('.............', tsyms[sym], false), price);
                }
                message.channel.send(finalMessage + '```');
            } catch (error) {
                throw error;
            }
        }).catch((error) => {
            console.log(error);
            message.channel.send('Not a valid crypto currency, try BTC or ETH.');
        });
    }
    pad(pad: string, str: string, padLeft: boolean) {
        if (typeof str === 'undefined') return pad;
        if (padLeft) return (pad + str).slice(-pad.length);
        else return (str + pad).substring(0, pad.length);
    }
    async run(client: Client, message: Message, args: string[]) {
        const symbols = args.map((str) => str.toUpperCase());
        const fromSymbol = symbols.shift();
        if (symbols.length === 0) symbols.push('USD');
        this.CrytpoComparePrice(fromSymbol, symbols, message);
    }
}