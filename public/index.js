$('#signup').submit(function (e) {
    e.preventDefault();
    var uname = $('#uname_reg').val();
    var pwd = $('#pwd_reg').val();
    var fname = $('#fname_reg').val();
    var lname = $('#lname_reg').val();
    var email = $('#mail_reg').val();
    var phn = $('#phone_reg').val();

    var data = JSON.stringify({
        "fname": fname,
        "lname": lname,
        "uname": uname,
        "email": email,
        "phone": phn,
        "pwd": pwd
    });
    console.log(data)
    $.ajax({
        url: '/signup',
        method: 'POST',
        contentType: 'application/json',
        data: data,
        success: (response) => {
            if (response.data == '0') {
                window.alert('Invalid Username')
            }
            else {
                window.alert(`Welcome ${response.data.fname}`)
            }
            userSync(response.data)
            $('#signup-modal').modal('hide')
        }
    })
})
//signup normal end
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
function sterilize(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
}
function getel(x) {
    return document.getElementById(x)
}
function userSync(data) {
    if (data == '0') {
        document.getElementById('dashboard1').style.display = 'none'
        document.getElementById('dashboard2').style.display = 'none'

        document.getElementById('myAds').style.display = 'none'
        document.getElementById('myCart').style.display = 'none'
        document.getElementById('logOut').style.display = 'none'

        document.getElementById('noUser1').style.display = 'block'
        document.getElementById('noUser2').style.display = 'block'
    }
    else {
        document.getElementById('dashboard1').style.display = 'block'
        document.getElementById('dashboard2').style.display = 'block'
        document.getElementById('myAds').style.display = 'block'
        document.getElementById('myCart').style.display = 'block'
        document.getElementById('logOut').style.display = 'block'
        document.getElementById('status').innerHTML = data.ID;
        document.getElementById('noUser1').style.display = 'none';
        document.getElementById('noUser2').style.display = 'none';

        document.getElementById('fnameUp').value = data.fname;
        document.getElementById('lnameUp').value = data.lname;
        document.getElementById('mailUp').value = data.email;
        console.log(data, data.phone)
        document.getElementById('pwdUp').value = data.pwd;
        document.getElementById('phoneUp').value = data.phone;
    }
}

function userstat() {
    $.ajax({
        url: '/userStat',
        contentType: 'application/json',
        success: (response) => {
            if (response.data == 'null') getel('status').innerHTML = '0';
            else getel('status').innerHTML = response.data.ID;
            userSync(response.data)
        }
    })
}
$(document).ready(() => {
    userstat()
})

$('#loginForm').submit(function (e) {
    e.preventDefault();
    var uname = $('#uname_login').val();
    var pwd = $('#pwd_login').val();
    var data = JSON.stringify({ uname: uname, pwd: pwd });
    console.log(data)
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
            if (getel('apiTyp').innerHTML == '1') window.location.reload(false)
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
    console.log(data)
    var id = $('#status').html();
    $.ajax({
        url: '/update/' + id,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (response) => {
            window.alert('updated')
            userSync(response.data)
            console.log(response.data)
            $('#update-modal').modal('hide')
        }
    })
})

function createTable(data, method) {
    var datalist = document.getElementById('products-posted');
    sterilize(datalist);
    data.forEach(function (rows) {
        var str = `
        <li class="list-group-item">
            <p id="prodid" style="visibility: hidden; width:0;height:0">${rows.productID}</p>
            <nav class="navbar navbar-expand-sm bg-light justify-content-end">
                <div class="navbar-brand"><img src="${rows.img1}" alt="" style="height: 40px;"></div>
                <ul class="navbar-nav flex-grow-0 ml-auto mr-1">
                    <li class="nav-item">
                        <div id="listTyp1">type:${rows.type}</div>

                        <div id="listDate1">Posted on:${rows.date}</div>
                    </li>

                    <li class="nav-item">
                        <a class="btn btn-primary" href="/${method}/${rows.productID}" >see more</a>
                    </li>
                </ul>
            </nav>
        </li>
        `;
        datalist.innerHTML += str;
        console.log(method, rows.productID)
    })
    $('#product-modal').modal({ show: true })
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

$('#myAds').click(() => { //my ads list
    var id = $('#status').html()
    $('#prod-list-title').html('My Ads');
    $.ajax({

        url: `/adz/${id}`,
        contentType: 'application/json',
        success: function (response) {
            createTable(response.data, 'showProduct')
        }
    })
})
