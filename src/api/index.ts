import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import io from 'socket.io-client';

export default class API extends EventEmitter {
    private uri: string;
    private ws: SocketIOClient.Socket;
    constructor() {
        super();
        this.uri = process.env.DATABASE_URI;
    }
    connect() {
        this.emit('connecting');
        this.ws = io(this.uri);
        this.ws.on('raw', (event: string, payload: {}) => {
            this.emit('raw', event, payload);
        });
        this.ws.on('disconnect', () => {
            this.emit('disconnect');
        });
        this.ws.on('error', (err: any) => {
            this.emit('error', err);
        })
        this.ws.on('connect_error', (err: any) => {
            this.emit('connect_error', err);
        });
        this.ws.on('reconnecting', (n: any) => {
            this.emit('reconnecting', n);
        });
        this.ws.on('reconnect_error', (err: any) => {
            this.emit('reconnect_error', (err));
        });
        this.ws.on('reconnect_failed', () => {
            this.emit('reconnect_failed');
        });
    }
    /**
     * 
     * @returns {Promise<{}>}
     * @param {string} path 
     */
    get(path: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            const response: any = await fetch(`${this.uri}${path}`).catch(reject);
            if (response.status !== 200) return reject(response);
            const body = await response.json().catch(reject);
            resolve(body);
        });
    }
    /**
     * 
     * @returns {Promise<{}>}
     * @param {string} path
     * @param {{}} partial 
     */
    post(path: string, partial: {}): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            const response: any = await fetch(`${this.uri}${path}`, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(partial),
            }).catch(reject);
            if (response.status !== 200) return reject(response);
            const body = await response.json().catch(reject);
            resolve(body);
        });
    }
    /**
     * 
     * @returns {Promise<{}>}
     * @param {string} path
     */
    delete(path: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            const response: any = await fetch(`${this.uri}${path}`, {
                method: 'delete',
            }).catch(reject);
            if (response.status !== 200) return reject(response);
            const body = await response.json().catch(reject);
            resolve(body);
        });
    }
}