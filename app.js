var session = require('express-session');
const path = require('path')
const express = require('express');
const mongoose = require('mongoose')

const bodyparser = require('body-parser');
var db = require('./data1.json');
var app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
app.listen(PORT);
app.use(bodyparser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

mongoose.connect('mongodb+srv://meme_lord:1234@cluster0.3sx7v.mongodb.net/usr?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

const carts = require('./schemas/carts')
const users = require('./schemas/users')
const products = require('./schemas/products')
const regists = require('./schemas/regists')
const notifs = require('./schemas/notifs')
//------------------------------------------------------------------
const regus = require('./usermanage/signup')
app.post('/signup', regus)

/**/
const sendnotif = require('./usermanage/sendnotif')
app.post('/sendnotif', sendnotif)

const getnotif = require('./usermanage/getnotiff')

app.get('/getnotiff/:id', getnotif)
const showcust = require('./usermanage/showcusts');

app.get('/showcusts/:pd', showcust)


app.get('/find/:cid/:pid', (req, res) => {
    var { cid, pid } = req.params;
    carts.find({ $and: [{ cusID: cid * 1 }, { prID: pid }] }, (err, rows) => {
        if (err) throw err;
        else {
            res.send({ data: (rows.length == 0) })
        }
    })
})
app.get('/',(req,res)=>{res.send({data:'hello'})})
app.post('/addtocart', (req, res) => {
    var own = req.body.to * 1;
    var pd = req.body.pd * 1;
    var cust = req.body.from * 1;
    var bargain = req.body.barg * 1;
    var time = req.body.time;
    var status = req.body.status

    carts.find({ $and: [{ cusID: cust }, { prID: pd }] }, (err, rws) => {
        if (rws.length) res.send({ data: '0' })
        else {
            regists.findById('idn', (err, data) => {
                var orderID = data.carts;
                var x = new carts({
                    orderID: orderID,
                    ownerID: own,
                    prID: pd,
                    cusID: cust,
                    bargain: bargain,
                    status: status,
                    time: time
                })
                x.save((erpr) => {
                    if (erpr) throw erpr
                    regists.findByIdAndUpdate('idn', { $inc: { carts: 1 } }, (er, rows) => {
                        if (er) throw er;
                        else res.send({ data: '1' })
                    })
                })
            })
        }
    })

})



app.get('/logout', (req, res) => {
    req.session.user = null;
    res.send({ data: '0' })
})
const login = require('./usermanage/login')
app.post('/loGin', login)

const upd = require('./usermanage/updateUsr');
app.post('/update/:id', upd)

app.get('/userStat', (req, res) => {
    //req.session.user = db.user[1];
    if (req.session.user == null) res.send({ data: '0' })
    else res.send({ data: req.session.user })
})
app.get('/', (req, res) => {
    res.send({ data: 'fak' })
})
app.get('/posts/:id', (req, res) => {
    products.find({ postedBy: req.params.id * 1 }).sort({ productID: 1 }).exec((err, dt) => {
        if (err) throw err;
        else {
            res.send({ data: dt })
        }
    })
})

app.get('/myCart/:id', (req, res) => {
    carts.aggregate([
        {
            $match: {
                $and: [{ "cusID": req.params.id * 1 }]
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "prID",
                foreignField: "productID",
                as: "pd"
            }
        },
        {
            $project: {
                data: "$pd"
            }
        }
    ], (err, rws) => {
        res.send({ data: rws[0].data })
    })
})
app.get('/showProduct/:id', (req, res) => {
    if (req.params.id == null) res.redirect('/showProduct/1')
    products.findOne({ productID: req.params.id * 1 }, (err, rows) => {
        if (err) res.redirect('/showProduct/1')
        else {
            if (rows != null) res.render('prod.ejs', { data: rows, type: '0' });
            else res.render('prod.ejs', { data: db.product[0], type: '0' });
            //res.send({ data: rows })
        }
    })
})

app.get('/products/', (req, res) => {
    products.find((err, data) => {
        if (err) throw err;
        else res.send({ data: data })
    })
})

app.get('/relate/:pid/:cid', async (req, res) => {
    var pid = req.params.pid * 1;
    var cid = req.params.cid * 1;
    products.find({ $and: [{ productID: pid }, { postedBy: cid }] }, (er, rws) => {
        if (rws.length) res.send({ data: '2' })
        else {
            carts.find({ $and: [{ prID: pid }, { cusID: cid }] }, (err, rows) => {
                if (err) throw err;
                else {
                    if (rows.length == 0) {
                        res.send({ data: '3' });
                    }
                    else {
                        if (rows[0].status == '1') { res.send({ data: '4' }); } //cust
                        else res.send({ data: '1' });
                    }
                }
            })
        }
    })
})


app.post('/postAd', (req, res) => {
    var { img1, img2, img3, img4, askedPrc, postedBy, date, type, details, img1name, img2name, img3name, img4name } = req.body
    regists.findById('idn', (er, reg) => {
        var pd = reg.products;
        var ad = new products({
            type: type,
            details: details,
            productID: pd,
            img1: img1,
            img2: img2,
            img3: img3,
            img4: img4,
            img1name: img1name,
            img2name: img2name,
            img3name: img3name,
            img4name: img4name,
            askedPrc: askedPrc,
            postedBy: postedBy,
            postedOn: date
        })
        ad.save((err) => {
            if (err) throw err;
            else {
                regists.findByIdAndUpdate('idn', { products: pd + 1 }, (errors, dt) => {
                    if (errors) throw errors;
                    else res.send({ data: '1' })
                })
            }
        })
    })
})

app.get('/users', (req, res) => {
    users.find((err, rows) => {
        if (err) throw err;
        else res.send({ data: rows.length })
    })
})

app.post('/setpropic', (req, res) => {
    var { ID, propic, imagname } = req.body;
    users.findOneAndUpdate({ ID: ID * 1 }, { $set: { propic: propic, imagname: imagname } }, (err, data) => {
        if (err) throw err;
        else {
            users.findOne({ ID: ID * 1 }, (er, dat) => {
                req.session.user = dat;
                res.send({ data: dat })
            })
        }
    })
})
app.post('/removeCt', (req, res) => {
    var { prID, cusID, ownerID } = req.body;
    carts.findOneAndDelete({ $and: [{ prID: prID * 1 }, { cusID: cusID * 1 }, { ownerID: ownerID * 1 }] }, (err, data) => {
        if (err) throw err;
        else res.send({ data: '1' })
    })
})

app.post('/removnotif', (req, res) => {
    var { sender, reciever, prod, type } = req.body;
    notifs.findOneAndDelete({ $and: [{ sender: sender }, { reciever: reciever }, { prod: prod }, { type: type }] }, (err, da) => {
        if (err) throw err;
        else res.send({ data: '1' })
    })
})

app.get('/checkCart/:cust/:own/:pd', (req, res) => {
    var { cust, own, pd } = req.params;
    carts.findOne({ $and: [{ cusID: cust, ownerID: own, prID: pd }] }, (err, rows) => {
        if (err) throw err;
        else {
            res.send({ data: rows })
        }
    })
})

app.get('/showUs/:id', (req, res) => {
    users.findOne({ ID: req.params.id * 1 }, (err, data) => {
        if (err) throw err;
        else {
            res.send({ data: data })
        }
    })
})

app.get('/test/', (req, res) => {
    var x = new carts({
        orderID: 1,
        ownerID: 1,
        prID: 1,
        cusID: 1,
        bargain: 1,
        status: 1,
        time: 1
    })
    x.save((err) => {
        res.send({ data: x })
    })
})
