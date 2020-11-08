const mongoose = require('mongoose')

const prodct = mongoose.Schema({
    type: { type: String, },
    details: { type: String },
    productID: { type: Number },
    img1: { type: String },
    img2: { type: String },
    img3: { type: String },
    img4: { type: String },
    img1name: { type: String },
    img2name: { type: String },
    img3name: { type: String },
    img4name: { type: String },
    askedPrc: { type: Number },
    postedBy: { type: Number },
    postedOn: { type: String }
})
const products = mongoose.model('products', prodct)

module.exports = products