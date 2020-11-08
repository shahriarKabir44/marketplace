const mongoose = require('mongoose')
const seqs = mongoose.Schema({
    _id: { type: String },
    users: { type: Number },
    products: { type: Number },
    carts: { type: Number },
    notifs: { type: Number }
})

const regists = mongoose.model('regists', seqs)
module.exports = regists