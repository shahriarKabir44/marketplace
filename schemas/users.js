const mongoose = require('mongoose')
const USERsc = mongoose.Schema({
    ID: { type: Number },
    fname: { type: String, },
    lname: { type: String },
    uname: { type: String, unique: true },
    email: { type: String },
    propic: { type: String },
    imagname: { type: String },
    phone: { type: String },
    pwd: { type: String }
})
const userSchema = mongoose.model('userSchema', USERsc)

module.exports = userSchema