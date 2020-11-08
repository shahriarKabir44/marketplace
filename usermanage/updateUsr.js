const mongoose = require('mongoose')
const users = require('../schemas/users')

function updu(req, res) {
    var { fname, lname, mail, pwd, phn } = req.body;
    var id = req.params.id;
    users.findOneAndUpdate({ ID: id * 1 }, { fname: fname, lname: lname, mail: mail, pwd: pwd, phn: phn }, (err, usr) => {
        if (err) throw err;
        else {
            users.findOne({ ID: id * 1 }, (er, dat) => {
                if (er) throw er;
                else {
                    console.log(dat);
                    req.session.user = dat;
                    res.send({ data: dat });
                }
            })
        }
    })
}

module.exports = updu