const mongoose = require('mongoose')
const users = require('../schemas/users')
const regists = require('../schemas/regists')

function registUs(req, res) {
    var { pwd, fname, lname, uname, email, propic, imagname, phone } = req.body;
    regists.findById('idn', (err, rw) => {

        var uid = rw.users;
        var user = new users({
            ID: uid,
            fname: fname,
            lname: lname,
            uname: uname,
            email: email,
            pwd: pwd,
            propic: propic,
            imagname: imagname,
            phone: phone
        })
        user.save((err) => {
            if (err) res.send({ data: '0' })
            else {
                req.session.user = user;
                regists.findByIdAndUpdate('idn', { $inc: { users: 1 } }, (er, dt) => {
                    res.send({ data: req.session.user });
                })
            }
        })
    })

}
module.exports = registUs;