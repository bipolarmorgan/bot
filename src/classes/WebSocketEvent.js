class WebSocketEvent {
    /**
     * 
     * @param {|'raw'|'ready'|'guildUpdate'|'userUpdate'|'tagUpdate'|'memberUpdate'|
     *          'disconnect'|'error'|'reconnecting'|'connect_error'|'reconnect_error'|'reconnect_failed'|
     *          'tagDeletion'|'memberDeletion'|'guildDelete'|'userDelete'|'memberDelete'|'tagDelete'} eventName 
     */
    constructor(eventName) {
        this.eventName = eventName;
    }
    run() {}
}
module.exports = WebSocketEvent;