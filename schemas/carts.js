const mongoose = require('mongoose')

const catr = mongoose.Schema({
    orderID: { type: Number },
    ownerID: { type: Number },
    prID: { type: Number },
    cusID: { type: Number },
    bargain: { type: Number },
    status: { type: Number },
    time: { type: String }
})

const cartz = mongoose.model('cartz', catr)

module.exports = cartz