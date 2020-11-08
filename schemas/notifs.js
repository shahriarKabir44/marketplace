const mongoose = require('mongoose')
const notifs = mongoose.Schema({
    notID: { type: Number },
    sender: { type: Number },
    reciever: { type: Number },
    type: { type: Number },
    seen: { type: Number },
    prod: { type: Number },
    barg: { type: Number },
    time: { type: String }
})
const notification = mongoose.model('notification', notifs)

module.exports = notification