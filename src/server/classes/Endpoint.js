const Router = require('express').Router;

class Endpoint {
    /**
     * 
     * @param {string} url 
     * @param {import('./Server')} client 
     */
    constructor(url, client) {
        this.url = url;
        this.client = client;
        this.route = Router();
    }
}
module.exports = Endpoint;