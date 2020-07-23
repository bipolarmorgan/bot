const { request, response } = require('express');
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {function} next 
 */
async function Authorization(req, res, next) {
    if (req.isAuthenticated()) next();
    res.redirect('/login');
}

module.exports = Authorization;