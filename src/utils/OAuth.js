/**
 * 
 * @param {string} path
 */
function invite(path) {
    const baseURL = `https://discordapp.com/oauth2/authorize?`
    return `${baseURL}client_id=${process.env.CLIENT_ID}&scope=bot&permissions=${process.env.CLIENT_PERMISSIONS}&redirect_uri=${encodeURIComponent(`${process.env.DOMAIN}${path}`)}`

}

module.exports = {
    createInvite: invite,
};