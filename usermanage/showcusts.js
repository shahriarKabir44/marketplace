const mongoose = require('mongoose')
const carts = require('../schemas/carts')

function showcust(req, res) {
    carts.aggregate([
        {
            $match: {
                $and: [{ "prID": req.params.pd * 1 }]
            }
        },
        {
            $lookup: {
                from: "userschemas",
                localField: "cusID",
                foreignField: "ID",
                as: "custm"
            }
        },
        {
            $project: {
                time: 1,
                bargain: 1,
                cusID: 1,
                orderID: 1,
                status: 1,
                senda: "$custm"
            }
        }
    ]).exec((err, data) => {
        if (err) throw err;
        else {
            for (var n = 0; n < data.length; n++) {
                data[n]["from"] = data[n].senda[0].fname + ' ' + data[n].senda[0].lname
                data[n].senda = null;
            }
            data.sort((a, b) => {
                return b.bargain - a.bargain
            })

            res.send({ data: data })
        }
    })
}

module.exports = showcust