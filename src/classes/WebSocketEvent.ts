export default class WebSocketEvent {
    public eventName: 'raw' | 'ready' | 'guildUpdate' | 'userUpdate' | 'tagUpdate' | 'memberUpdate' | 'disconnect' | 'error' | 'reconnecting' | 'connect_error' | 'reconnect_error' | 'reconnect_failed' | 'tagDeletion' | 'memberDeletion' | 'guildDelete' | 'userDelete' | 'memberDelete' | 'tagDelete' | 'connecting';
    constructor(eventName: 'raw' | 'ready' | 'guildUpdate' | 'userUpdate' | 'tagUpdate' | 'memberUpdate' | 'disconnect' | 'error' | 'reconnecting' | 'connect_error' | 'reconnect_error' | 'reconnect_failed' | 'tagDeletion' | 'memberDeletion' | 'guildDelete' | 'userDelete' | 'memberDelete' | 'tagDelete' | 'connecting') {
        this.eventName = eventName;
    }
}