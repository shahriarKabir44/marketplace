const mongoose = require('mongoose')
const notifs = require('../schemas/notifs')

function getnotif(req, res) {
    notifs.aggregate([
        {
            $match: {
                $and: [{ "reciever": req.params.id * 1 }]
            }
        },
        {
            $lookup: {
                from: "userschemas",
                foreignField: "ID",
                localField: "sender",
                as: "custm"
            }
        },
        {
            $lookup: {
                from: "products",
                foreignField: "productID",
                localField: "prod",
                as: "pd"
            }
        },
        {
            $project: {
                p: "$custm.fname",
                q: "$custm.lname",
                type: 1,
                sender: 1,
                seen: 1,
                pd: "$pd.type",
                reciever: 1,
                prod: 1,
                barg: 1,
                time: 1,
                notID: 1
            }
        }
    ], (err, rws) => {
        if (err) throw err;
        else {
            for (let n = 0; n < rws.length; n++) {
                rws[n]['from'] = rws[n].p[0] + ' ' + rws[n].q[0];
                rws[n].p = null;
                rws[n].q = null;
                rws[n]['pd'] = rws[n]['pd'][0]
            }
            rws.sort((a, b) => {
                return b.notID - a.notID
            })
            res.send({ data: rws })
        }
    })
}

module.exports = getnotif