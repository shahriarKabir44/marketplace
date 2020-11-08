//firebase stuff
var firebaseConfig = {
    apiKey: "AIzaSyBQSes_ECwHaryrF8vfsjVD_1wWf7cz8Wc",
    authDomain: "pqrs-9e8eb.firebaseapp.com",
    databaseURL: "https://pqrs-9e8eb.firebaseio.com",
    projectId: "pqrs-9e8eb",
    storageBucket: "pqrs-9e8eb.appspot.com",
    messagingSenderId: "998501066190",
    appId: "1:998501066190:web:0be1a2a2d5116d7c77b79f",
    measurementId: "G-54PCTERKRM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//notifications and stuff



$('#notifications').click((e) => {
    e.preventDefault();
    shownotifs();
    $('#notif_modal').modal({ show: true })
})
function shownotifs() {
    var dataset = getel('notif_list')
    showCusts()
    sterilize(dataset)
    $.ajax({
        url: '/getnotiff/' + getel('status').innerHTML,
        contentType: 'application/json',
        success: (res) => {
            console.log(res.data)
            for (var n = 0; n < res.data.length; n++) {
                var li = document.createElement('li');
                if (res.data[n].type == '1') {
                    var st = `<button class="btn btn-light" id=cusname${n} onclick="showUs(${res.data[n].sender})" style="float:left">${res.data[n].from} </button> <p style="float:left"> wants to buy your </p> <a href="/showProduct/${res.data[n].prod}"><button class="btn btn-light" id=pdnm${n} style="float:left"> ${res.data[n].pd}</button></a>
                    <p style="float:left">at price </p> <p id=bargn${n} style="float:left">${res.data[n].barg} </p><hr>`;
                    li.innerHTML = st;
                    dataset.appendChild(li);
                }
                else if (res.data[n].type == '2') //accepted offer..awaiting confirmation
                {
                    var st = `<button class="btn btn-light" id=cusname${n} onclick="showUs(${res.data[n].sender})" style="float:left">${res.data[n].from} </button> <p style="float:left"> would like to sell </p> <a href="/showProduct/${res.data[n].prod}"><button class="btn btn-light" id=pdnm${n} style="float:left"> ${res.data[n].pd}</button></a> <p style="float:left">at price </p> <p id=bargn${n} style="float:left">${res.data[n].barg} </p><hr>`;
                    li.innerHTML = st;
                    dataset.appendChild(li);
                }
                else if (res.data[n].type == '3') //offer rejected by seller
                {
                    var dt = res.data[n];
                    var { rcv, type, sender, seen, pd, reciever, prod, barg, time, from } = dt;
                    var a = `<button class="btn btn-light" id=cusname${n} onclick="showUs(${res.data[n].sender})" style="float:left">${from}</button> <p style="float:left"> might consider selling </p> <a href="/showProduct/${res.data[n].prod}"><button class="btn btn-light" id=pdnm${n} style="float:left"> ${res.data[n].pd}</button></a> <p style="float:left"> if you reconsider your price</p>`;

                    var st = a;
                    li.innerHTML = st;
                    dataset.appendChild(li);
                }
            }
        }
    })
}

function showUs(x) {
    console.log(x)
    $.ajax({

        url: '/showUs/' + x,
        contentType: 'application/json',
        success: (res) => {
            getel('usImg').src = res.data.propic;
            getel('usnm').innerHTML = res.data.fname + ' ' + res.data.lname;
            $('#showUs').modal({ show: true })
        }
    })
}

function rejectOfrr(cust, pd, own, bargain, orderID) {
    if (window.confirm('are you sure?')) {
        var type = {
            "type": 1,
            "bargain": bargain,
            "orderID": orderID
        }
        removeCart(cust, pd, own, type)
    }
}

//show custs
function showCusts() {
    var pd = getel('pID').innerHTML;
    var dataset = getel('tbd_custs')
    sterilize(dataset)
    $.ajax({
        url: `/showcusts/` + pd,
        contentType: 'application/json',
        success: (resp) => {
            for (let n = 0; n < resp.data.length; n++) {
                var tr = document.createElement('tr');
                var name = document.createElement('td');
                var price = document.createElement('td');
                var date = document.createElement('td');
                var act1 = document.createElement('td');
                var act2 = document.createElement('td');
                var pend = document.createElement('td');
                pend.innerHTML = 'Pending Confirmation';
                var x = resp.data[n];

                var confirmSellBtn1 = document.createElement('button');
                confirmSellBtn1.className = 'btn btn-success acpt'
                confirmSellBtn1.innerHTML = 'Accept Offer!'

                var rejectOfr = document.createElement('button');
                rejectOfr.className = 'btn btn-danger '
                rejectOfr.innerHTML = 'Reject Offer!'
                rejectOfr.onclick = () => { rejectOfrr(x.cusID, getel('pID').innerHTML, getel('owner').innerHTML, x.bargain, x.orderID) }

                act2.appendChild(rejectOfr);
                confirmSellBtn1.onclick = () => { confirmSell(x.from, x.time, x.bargain, x.cusID, x.orderID, x.status) }
                act1.appendChild(confirmSellBtn1)
                act1.style.display = 'none'
                act2.style.display = 'none'
                pend.style.display = 'none'

                let showNm = document.createElement('u')

                var p = document.createElement('p')
                p.id = 'custl' + n
                p.innerHTML = resp.data[n].cusID;
                p.style.visibility = 'hidden';

                showNm.innerHTML = resp.data[n].from;

                name.appendChild(showNm)
                showNm.onclick = () => { showUs(resp.data[n].cusID) }
                price.innerHTML = resp.data[n].bargain;
                date.innerHTML = resp.data[n].time;
                if (getel('status').innerHTML * 1 == getel('owner').innerHTML * 1) {
                    act1.style.display = 'block'
                    act2.style.display = 'block',
                        pend.style.display = 'block'
                }
                price.id = 'priceProdList' + resp.data[n].orderID
                tr.appendChild(name);
                tr.appendChild(price);
                tr.appendChild(date);
                if (resp.data[n].status == '0') {
                    tr.appendChild(act1);
                    tr.appendChild(act2);
                }
                else tr.appendChild(pend)
                dataset.appendChild(tr)
            }
        }
    })
}
//show custs end



// notifications and stuff end
//normal
$(document).ready(() => {
    //showCusts();
    $.ajax({
        url: '/products',
        contentType: 'application/json',
        success: (res) => {
            document.getElementById('prods').innerHTML = JSON.stringify(res.data)
        }
    })
})


function sterilize(node) {
    node.innerHTML = ''
}
function getel(x) {
    return document.getElementById(x)
}
function userSync(data) {

    if (data == '0') {
        showCusts()
        getel('dashboard1').style.display = 'none'
        getel('DROPDN').style.display = 'none';
        getel('dashboard2').style.display = 'none'
        getel('status').innerHTML = ''
        getel('myAds').style.display = 'none'
        getel('myCart').style.display = 'none'
        getel('logOut').style.display = 'none'
        getel('notifications').style.display = 'none'
        getel('noUser1').style.display = 'block'
        getel('noUser2').style.display = 'block'
        try {
            for (var n = 1; n <= 2; n++) {
                getel('myProd' + n).style.display = 'none'
            }
            for (var n = 1; n <= 1; n++) {
                getel('General' + n).style.display = 'block'
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        getel('dashboard1').style.display = 'block'
        getel('dashboard2').style.display = 'block'
        getel('DROPDN').style.display = 'block';
        getel('myAds').style.display = 'block'
        getel('myCart').style.display = 'block'
        getel('logOut').style.display = 'block'
        getel('notifications').style.display = 'block'
        getel('status').innerHTML = data.ID;
        getel('noUser1').style.display = 'none';
        getel('noUser2').style.display = 'none';
        getel('propicdsbd').src = data.propic;
        console.log(data)
        prod2usrrelt(getel('pID').innerHTML, getel('status').innerHTML)
        shownotifs();
        getel('dashbdSpin').style.display = 'none'
        getel('fnameUp').value = data.fname;
        getel('lnameUp').value = data.lname;
        getel('mailUp').value = data.email;
        getel('pwdUp').value = data.pwd;
        getel('phoneUp').value = data.phone;
    }
}
console.log(document.cookie)

$('#loginForm').submit(function (e) {
    e.preventDefault();
    var uname = $('#uname_login').val();
    var pwd = $('#pwd_login').val();
    var data = JSON.stringify({ uname: uname, pwd: pwd });
    $.ajax({
        url: '/loGin',
        method: 'POST',
        contentType: 'application/json',
        data: data,
        success: (response) => {
            if (response.data == '0') {
                window.alert('Invalid User')
            }
            else {
                window.alert(`Welcome ${response.data.fname}`)
            }
            userSync(response.data)
            $('#login-modal').modal('hide')
        }
    })
})

var db = {}

function setPropic(typ) {
    $.ajax({
        url: '/users',
        contentType: 'application/json',
        success: (res) => {
            var st = 'propic/' + res.data;
            db = {}
            upload(st, ['proPic' + typ], 0, 0);
        }
    })
}

var signuptyp = 0;

getel('login_cart').onclick = () => {
    $('#login-modal-cart').modal({ show: true })
}

getel('signup_cart').onclick = () => {
    $('#signup-modal1').modal({ show: true })
}

function signup(typ) {
    var uname = $('#uname_reg' + typ).val();
    var pwd = $('#pwd_reg' + typ).val();
    var fname = $('#fname_reg' + typ).val();
    var lname = $('#lname_reg' + typ).val();
    var email = $('#mail_reg' + typ).val();
    var phn = $('#phone_reg' + typ).val();
    var imgln = 'https://firebasestorage.googleapis.com/v0/b/pqrs-9e8eb.appspot.com/o/propic%2F'
    var data = JSON.stringify({
        "fname": fname,
        "lname": lname,
        "uname": uname,
        "email": email,
        "phone": phn,
        "pwd": pwd,
        "propic": null,
        "imagname": null
    });
    $.ajax({
        url: '/signup',
        method: 'POST',
        contentType: 'application/json',
        data: data,
        success: (response) => {

            if (response.data == '0') {
                window.alert('Invalid Username');
                getel('signupSpin').style.display = 'none';
            }
            else {
                setPropic(typ)
                $.ajax({
                    url: '/users',
                    contentType: 'appliation/json',
                    success: (res) => {
                        var lin = imgln + res.data + 'proPic?alt=media';
                        var data = JSON.stringify({ "ID": response.data.ID, "propic": lin, "imagname": `propic/${res.data}proPic` })
                        $.ajax({
                            url: '/setpropic',
                            data: data,
                            method: 'POST',
                            contentType: 'application/json',
                            success: (ans) => {
                                getel('signupSpin').style.display = 'none';
                                alert('Welcome ' + ans.data.fname + ' ' + ans.data.lname);
                                getel('status').innerHTML = ans.data.ID;
                                userSync(ans.data)
                                console.log(lin)
                                if (typ == '1') addtocart(ans.data.ID, getel('pID').innerHTML)
                                //signuptyp = 0;
                            }
                        })
                    }
                })
            }
            userSync(response.data)
            $('#signup-modal' + typ).modal('hide')
        }
    })
}

//signup normal
$('#signup').submit(function (e) {
    e.preventDefault();
    getel('signupSpin').style.display = 'block';
    signup('')

})
//signup normal end
//signup add cart
$('#signup1').submit(function (e) {
    e.preventDefault();
    getel('signupSpin').style.display = 'block';
    signup('1')

})
// signup add cart end
$('#logOut').click((e) => {
    e.preventDefault();
    $.ajax({
        url: '/logout',
        contentType: 'application/json',
        success: (res) => {
            userSync(res.data)
        }
    })
})


$('#UpdateUser').submit((e) => {
    e.preventDefault();
    var fname = document.getElementById('fnameUp').value;
    var lname = document.getElementById('lnameUp').value;
    var mail = document.getElementById('mailUp').value;
    var pwd = document.getElementById('pwdUp').value;
    var phn = document.getElementById('phoneUp').value;
    var data = {
        fname: fname,
        lname: lname,
        mail: mail,
        pwd: pwd,
        phn: phn
    }
    var id = $('#status').html();
    $.ajax({
        url: '/update/' + id,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (response) => {
            window.alert('updated')
            userSync(response.data)
            $('#update-modal').modal('hide')
        }
    })
})

function createTable(data, method) {
    if (data.length == 0) {
        datalist.innerHTML = 'Nothing to see here :('
        $('#product-modal').modal({ show: true });
        return;
    }
    var datalist = document.getElementById('products-posted');
    sterilize(datalist);

    console.log(data)
    data.forEach(function (rows) {
        var str = `
        <li class="list-group-item">
            <p id="prodid" style="visibility: hidden; width:0;height:0">${rows.productID}</p>
            <nav class="navbar navbar-expand-sm bg-light justify-content-end">
                <div class="navbar-brand"><img src="${rows.img1}" alt="" style="height: 40px;"></div>
                <ul class="navbar-nav flex-grow-0 ml-auto mr-1">
                    <li class="nav-item">
                        <div id="listTyp1">type:${rows.type}</div>
    
                        <div id="listDate1">Posted on:${rows.postedOn}</div>
                    </li>
    
                    <li class="nav-item">
                        <a class="btn btn-primary" href="/${method}/${rows.productID}" >see more</a>
                    </li>
                </ul>
            </nav>
        </li>
        `;
        datalist.innerHTML += str;
    })

}
$('#myCart').click(() => {
    var id = $('#status').html()
    $('#prod-list-title').html('My Cart');
    $.ajax({
        url: `/myCart/${id}`,
        contentType: 'application/json',
        success: function (response) {
            createTable(response.data, 'showProduct')
        }
    })
})

function showAd() {
    var id = $('#status').html()
    $('#prod-list-title').html('My Ads');
    $.ajax({

        url: `/posts/${id}`,
        contentType: 'application/json',
        success: function (response) {
            console.log(response.data)
            createTable(response.data, 'showProduct')
        }
    })
}

$('#myAds').click(() => { //my ads list
    showAd()
})

//normal end


// add to cart stuff
$('#General1').click((e) => {
    e.preventDefault();
    if (getel('status').innerHTML == '') {
        $('#add_cart_login').modal({ show: true })
    }
    else {
        addtocart(getel('status').innerHTML, getel('pID').innerHTML)
    }
})
function addtocart(cid, pid) {
    getel('bargainPc').value = getel('prc').innerHTML;
    $('#bargain-modal').modal({ show: true });
    $('#bargain').submit((e) => {
        e.preventDefault();
        $('#bargain-modal').modal('hide');
        var barg = getel('bargainPc').value;
        if ((barg * 1) % 1 != 0) {
            window.alert('offered price must be a number');
            getel('bargainPc').value = getel('prc').innerHTML;
            $('# bargain-modal').modal({ show: true });
        }
        else {
            var dt = new Date();
            var tme = dt.getDay() + '/' + dt.getMonth() + '/' + dt.getFullYear() + '-' + dt.getHours() + ':' + dt.getMinutes();
            var from = getel('status').innerHTML;
            var to = getel('owner').innerHTML;
            var pd = getel('pID').innerHTML;
            var data = JSON.stringify({ from: from, to: to, pd: pd, barg: barg, time: tme, status: 0 });
            $.ajax({
                url: `/find/${cid}/${pid}`,
                contentType: 'application/json',
                success: (res) => {
                    decide('1');
                    if (res.data == '0') {
                        window.alert('Product was already into your cart');
                        decide('1')
                    }
                    else {
                        $.ajax({
                            url: '/addtocart',
                            contentType: 'application/json',
                            method: 'POST',
                            data: data,
                            success: (resp) => {
                                window.alert('Successfully Added to cart!')
                                decide('1');
                                showCusts()
                                data = JSON.parse(data);
                                data['type'] = '1';
                                data['notifType'] = '1'
                                console.log(data)
                                data = JSON.stringify(data)
                                $.ajax({
                                    url: '/sendnotif',
                                    data: (data),
                                    contentType: 'application/json',
                                    method: 'POST',
                                    success: (respn) => {
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    })
}

//add to cart modal handle
$('#loginCart').submit(function (e) {
    e.preventDefault();
    var uname = $('#uname_login1').val();
    var pwd = $('#pwd_login1').val();
    var data = JSON.stringify({ uname: uname, pwd: pwd });
    $.ajax({
        url: '/loGin/',
        method: 'POST',
        contentType: 'application/json',
        data: data,
        success: (response) => {
            if (response.data == '0') {
                window.alert('Invalid User')
            }
            else {
                if (response.data.ID * 1 == getel('owner').innerHTML * 1) {
                    window.alert('You own this product!')
                }
                else addtocart(response.data.ID, getel('pID').innerHTML)
            }
            userSync(response.data)
            $('#login-modal-cart').modal('hide')
        }
    })
})

function prod2usrrelt(pid, cid) {
    if (getel('status').innerHTML == '') decide('3');
    else {
        $.ajax({
            url: '/relate/' + pid + '/' + cid,
            contentType: 'application/json',
            success: (res) => {
                decide(res.data)
            }
        })
    }
}

var GLOBALDATACONF = {}
var GLOBALCOUNTDNSTOP = 1;
getel('countDounBtn').onclick = () => { GLOBALCOUNTDNSTOP = 0; }
function countDoun(ctdn, state) {
    if (state > 0 && GLOBALCOUNTDNSTOP) {
        setTimeout(() => {

            ctdn.innerHTML = `Cancel ( ${state - 1} s)`
            countDoun(ctdn, state - 1);

        }, 1000)
    }
    else if (GLOBALCOUNTDNSTOP) {
        acceptOffer(getel('pID').innerHTML, GLOBALDATACONF.cusID, GLOBALDATACONF.orderID, GLOBALDATACONF.bargain)
        $('#confirm_sell').modal('hide')
        return
    }
    if (!GLOBALCOUNTDNSTOP) {
        $('#confirm_sell').modal('hide')
        return
    }
}

getel('AcceptOfferbtn').onclick = () => {
    acceptOffer(getel('pID').innerHTML, GLOBALDATACONF.cusID, GLOBALDATACONF.orderID, GLOBALDATACONF.bargain);
    GLOBALCOUNTDNSTOP = 0;
    $('#confirm_sell').modal('hide')
}

function confirmSell(from, time, bargain, cusID, orderID, status) {
    var data = {
        "from": from,
        "time": time,
        "bargain": bargain,
        "cusID": cusID,
        "orderID": orderID,
        "status": status
    }
    GLOBALDATACONF = data;
    GLOBALCOUNTDNSTOP = 1;
    getel('buyerProd').innerHTML = data.from;
    getel('confirmBargain').innerHTML = data.bargain;
    $('#confirm_sell').modal({ show: true })
    var ctdn = getel('countDounBtn');
    ctdn.innerHTML = 'Cancel ( 60 s)'
    countDoun(ctdn, 60)
}

function acceptOffer(pd, cust, orderID, price) {
    var data = {
        to: cust,
        from: getel('owner').innerHTML,
        type: 2,
        seen: 0,
        pd: pd,
        barg: price,
        order: orderID,
        notifType: 2
    }
    $.ajax({
        url: '/sendnotif',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (resp) => {
            showCusts()
            var acp = document.getElementsByClassName('acpt')
            for (var n = 0; n < acp.length; n++) {
                acp[n].style.display = 'none'
            }
        }
    })
}


//login user to add to cart


function decide(typ) {

    if (typ == '3') {
        for (var n = 1; n <= 3; n++) {
            getel('myProd' + n).style.display = 'none'
        }
        for (var n = 1; n <= 1; n++) {
            getel('General' + n).style.display = 'block'
        }
    }
    else {
        for (var n = 1; n <= 2; n++) {
            getel('myProd' + n).style.display = 'block'
        }
        for (var n = 1; n <= 1; n++) {
            getel('General' + n).style.display = 'none'
        }
    }
    if (typ == '1') {
        getel('myProd1').style.display = 'none';
        getel('myProd2').style.display = 'block';

    }
    else if (typ == '4') {
        getel('myProd1').style.display = 'none';
        getel('myProd2').style.display = 'block';
        getel('myProd3').style.display = 'block';
    }
    else if (typ == '2') {

        getel('myProd1').style.display = 'block';
        getel('myProd2').style.display = 'none';
    }

}


//-------------carts stuff end
function userstat() {
    $.ajax({
        url: '/userStat',
        contentType: 'application/json',
        success: (response) => {
            if (response.data == 'null') getel('status').innerHTML = '';
            else getel('status').innerHTML = response.data.ID;
            userSync(response.data)
        }
    })
}
$(document).ready(() => {
    userstat()
})


$(document).ready(() => {
    if (getel('status').innerHTML == '') decide('3');
    else {
        prod2usrrelt(getel('status').innerHTML, getel('pID').innerHTML)
    }
})

//post ad


$('#postAds').submit((e) => {
    e.preventDefault();
    var files = ['file1', 'file2', 'file3', 'file4'];
    $.ajax({
        url: '/posts/' + getel('status').innerHTML,
        contentType: 'application/json',
        success: (res) => {
            db = {}
            alert('We will notify you as soon as your images are uploaded')
            upload('posts/' + getel('status').innerHTML + '/' + res.data.length + '/', files, 0, res.data.length)
        }
    })
})



function postAd(lent) {
    var tm = new Date()
    var tim = tm.getDate() + '/' + (tm.getMonth() * 1 + 1) + '/' + tm.getFullYear() + ' ' + tm.getHours() + ':' + tm.getMinutes() + ':' + tm.getSeconds()

    var data = {
        "img1": db.file1,
        "img2": db.file2,
        "img3": db.file3,
        "img4": db.file4,
        "askedPrc": getel('AskedPricePostAd').value,
        "postedBy": getel('status').innerHTML,
        "date": tim,
        "type": getel('sel1').value,
        "details": getel('DescrPostAd').value,
        "img1name": 'posts/' + getel('status').innerHTML + '/' + lent + '/file1',
        "img2name": 'posts/' + getel('status').innerHTML + '/' + lent + '/file2',
        "img3name": 'posts/' + getel('status').innerHTML + '/' + lent + '/file3',
        "img4name": 'posts/' + getel('status').innerHTML + '/' + lent + '/file4'
    }
    $.ajax({
        url: '/postAd',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(data),
        success: (res) => {
            window.alert('done!')
            $('#postAd-modal').modal('hide')
            showAd();
        }
    })
}

function upload(namee, filez, state, lnt) {
    const ref = firebase.storage().ref()
    const file = document.querySelector("#" + filez[state]).files[0]
    var x = filez.length == 1 ? 'proPic' : filez[state];
    const name = namee + x;
    const metadata = {
        contentType: file.type
    }
    const task = ref.child(name).put(file, metadata)
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            db["" + filez[state]] = url
            if (state < filez.length - 1) {
                upload(namee, filez, state + 1, lnt)
            }
            else {
                if (filez.length != 1) postAd(lnt)
            }
        })
}

//post ad end


//remove from cart

getel('myProd2').onclick = () => {
    removeCart(getel('status').innerHTML, getel('pID').innerHTML, getel('owner').innerHTML, { "type": 0 })
}

function removeCart(cus, pd, own, typer) {
    var data = JSON.stringify({
        "prID": pd,
        "cusID": cus,
        "ownerID": own
    })
    $.ajax({
        method: 'POST',
        contentType: 'application/json',
        data: data,
        url: '/removeCt',
        success: (res) => {
            var body = JSON.stringify({
                "sender": cus,
                "reciever": own,
                "prod": pd,
                "type": 1
            })
            $.ajax({
                method: 'POST',
                contentType: 'application/json',
                data: body,
                url: '/removnotif',
                success: (resp) => {
                    var dataset = getel('tbd_custs')
                    sterilize(dataset)
                    showCusts();
                    prod2usrrelt(pd, getel('status').innerHTML)
                    if (typer.type) {
                        rejectNotif(cus, own, pd, typer.bargain, typer.orderID)
                    }
                }
            })
        }
    })
}

//remove from cart end

function rejectNotif(cust, own, pd, bargain, orderID) {
    var data = JSON.stringify({
        "from": own,
        "pd": pd,
        "to": cust,
        "type": 1,
        "barg": bargain,
        "order": orderID,
        "notifType": "3"
    })
    $.ajax({
        url: '/sendnotif',
        contentType: 'application/json',
        method: 'POST',
        data: data,
        success: (resp) => {

        }
    })

}
