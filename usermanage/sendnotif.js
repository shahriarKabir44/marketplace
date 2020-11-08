const regists = require('../schemas/regists')
const carts = require('../schemas/carts')
const notifs = require('../schemas/notifs')
function sendnotif(req, res) {
    var { from, pd, to, type, barg, order, notifType } = req.body;
    var tm = new Date()
    var tim = tm.getDate() + '/' + (tm.getMonth() * 1 + 1) + '/' + tm.getFullYear() + ' ' + tm.getHours() + ':' + tm.getMinutes() + ':' + tm.getSeconds()
    if (type * 1 == 2) {

        carts.findOneAndUpdate({ orderID: order * 1 }, { status: 1 }, (err, dat) => {
            if (err) throw err;
            regists.findById('idn', (er, reg) => {
                var oid = reg.notifs;
                var x = new notifs({
                    notID: oid * 1,
                    sender: from * 1,
                    reciever: to * 1,
                    type: notifType * 1,
                    seen: 0,
                    prod: pd * 1,
                    barg: barg * 1,
                    time: tim
                })
                x.save((shit) => {
                    if (shit) throw shit
                    else {
                        regists.findByIdAndUpdate('idn', { $inc: { notifs: 1 } }, (er, rw) => {
                            if (err) throw er;
                            res.send({ data: '1' })
                        })
                    }
                })
            })
        })
    }
    else {
        regists.findById('idn', (er, reg) => {
            var oid = reg.notifs;
            var x = new notifs({
                notID: oid,
                sender: from,
                reciever: to,
                type: notifType,
                seen: 0,
                prod: pd,
                barg: barg,
                time: tim
            })
            x.save((shit) => {
                if (shit) throw shit;
                else {
                    regists.findByIdAndUpdate('idn', { $inc: { notifs: 1 } }, (er, rw) => {
                        if (er) throw er;
                        res.send({ data: '1' })
                    })
                }
            })
        })
    }
}

module.exports = sendnotif