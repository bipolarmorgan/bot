import Command from '../../classes/BaseCommand';
import { Message } from 'discord.js';
import Client from '../../classes/Unicron';
import fetch from 'node-fetch';

export default class Foaas extends Command {
    private endpoints: string[];
    constructor() {
        super({
            config: {
                name: 'foaas',
                description: 'Sends a Random F*ck Off As A Service!',
                permission: 'User',
            },
            options: {
                aliases: ['fuckoff', 'ffs'],
                clientPermissions: [],
                cooldown: 10,
                nsfwCommand: true,
                args: false,
                usage: '',
                donatorOnly: false,
                premiumServer: false,
            }
        });
        this.endpoints = [
            '/asshole/', '/awesome/',
            '/bag/', '/because/',
            '/bucket/', '/bye/',
            '/cool/', '/cup/',
            '/even/', '/everyone/',
            '/everything/', '/family/',
            '/fascinating/', '/flying/',
            '/ftfy/', '/fyyff/',
            '/give/', '/holygrail/',
            '/horse/', '/idea/',
            '/immensity/', '/jinglebells/',
            '/life/', '/logs/',
            '/looking/', '/maybe/',
            '/me/', '/mornin/',
            '/no/', '/pink/',
            '/programmer/', '/question/',
            '/ratsarse/', '/retard/',
            '/ridiculous/', '/rtfm/',
            '/sake/', '/shit/',
            '/single/', '/thanks/',
            '/that/', '/this/',
            '/too/', '/tucker/',
            '/what/', '/zayn/',
            '/zero/',
        ];
    }
    async run(client: Client, message: Message, args: string[]) {
        const from = message.author.tag;
        try {
            const response = await fetch(`https://www.foaas.com${this.endpoints[Math.floor(Math.random() * this.endpoints.length)]}${encodeURIComponent(from)}`, {
                headers: {
                    Accept: 'application/json'
                }
            });
            const body = await response.json();
            return message.channel.send(body.message);
        } catch (e) {
            throw e;
        }
    }
}