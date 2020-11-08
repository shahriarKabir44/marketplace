const mongoose = require('mongoose')
const users = require('../schemas/users')

function login(req, res) {
    var { uname, pwd } = req.body;
    users.find({ $and: [{ uname: uname }, { pwd: pwd }] }, (err, rws) => {
        if (!rws.length) res.send({ data: '0' })
        else {
            req.session.user = rws[0];
            res.send({ data: rws[0] })
        }
    })
}
module.exports = login