var mysql = require('mysql');
var bodyParser = require('body-parser')
const express = require('express');
const session = require('express-session');
const cors = require('cors');
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "market",
    port:"3306"
});
var app = express();
app.use(session({
    secret: 'somerandonstuffs',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(cors(corsOptions))
// ================================================delete all order cart ====================================================
app.post('/deleteOrder', (req, res) => {
    let obj = req.body;
    // console.log("deleteOrder ==== : ", obj)
    let Query = `DELETE FROM carts_products WHERE orderId = ${Number(obj.orderId)}`;
    con.query(Query, function (err, result, fields) {
        console.log("deleted products ====: ", result);
        res.send(result);
    })
})
// ====================================================== getNewOid ====================================================
app.post('/getNewOid', (req, res) => {
    let obj = req.body;
    // console.log("getNewOid ==== : ", obj);
    let Query = `SELECT * FROM orders WHERE uid='${obj.uid}' AND finish='0'`;
    con.query(Query, function (err, result, fields) {
        // console.log("getNewOid result ====: ", result);
        res.send(result);
    })
})
// ====================================================== Add new product====================================================
app.post('/AddNewProduct', (req, res) => {
    let obj = req.body;
    console.log("NEW PRODUCT ==== : ", req.body);
    let Query = `INSERT INTO products (name,new_price,image,catagory_id,imgChanged,description) VALUES ('${obj.name}','${obj.price}','${obj.image}','${obj.categoryId}','${obj.imgChanged}','${obj.Description}')`;
    con.query(Query, function (err, result, fields) {
        // console.log("result ====: ", result);
        res.send(result);
    })
})
// ====================================================== Admin delete product  ====================================================
app.post('/deleteProduct', (req, res) => {
    // console.log("Delete : ", req.body);
    let obj = req.body;
    let Query = `DELETE FROM products WHERE id = ${Number(obj.productId)}`;
    con.query(Query, function (err, result, fields) {
        res.send("1");
    })
})
// ====================================================== search product ====================================================

app.post('/searchProduct', (req, res) => {
    let obj = req.body;
    // console.log("search product ==== : ", req.body);
    let Query = `SELECT * FROM products WHERE name='${obj.name}'`;
    con.query(Query, function (err, result, fields) {
        console.log("result ====: ", result);
        res.send(result);
    })
})
// ====================================================== Update Image ====================================================
app.post('/UpdateImage', (req, res) => {
    let url = req.body.NewURL;
    let Id = JSON.stringify(req.body.ImageId)
    console.log("req.body.productName; = ", req.body.ImageId)
    console.log("req.body.newURL; = ", req.body.NewURL)
    con.query(`UPDATE products SET image='${url}',imgChanged='1' WHERE id='${Id}'`, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})
// ====================================================== Update Product ====================================================
app.post('/UpdateProduct', (req, res) => {
    let name = req.body.productName;
    let Id = JSON.stringify(req.body.productId)
    let price = req.body.productPrice;
    let description = req.body.description;
    console.log("req.body.UpdateProduct = ", req.body)

    con.query(`UPDATE products SET name='${name}',new_price='${price}',description='${description}' WHERE id='${Id}'`, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})
// ========================================================== Fill user cart according to order id===============================================================================================
app.post('/FillCart', (req, res) => {
    let Query = `SELECT * FROM carts_products WHERE orderId='${req.body.orderId}'`;
    con.query(Query, function (err, result, fields) {
        // console.log("cart === ", result)
        res.send(result);
    })
})
// ================================================================== Bring last purchase date =======================================================================================
app.post('/LastDate', (req, res) => {
    let Query = `SELECT * FROM orders WHERE uid='${req.body.uid}' ORDER BY order_id DESC`;
    con.query(Query, function (err, result, fields) {
        res.send(result);
    })
})
// ================================================================== Start session after login =======================================================================================
app.post('/loginSession', function (req, res) {
    sess = req.session;
    req.session.user_name = req.body.user_name; //params['email']; 
    req.session.mail = req.body.mail; //params['password'];
    sess.mail;
    sess.user_name;
    res.send(req.session.user_name + ":" + req.session.mail)
})
// ============================================================ Sllice 400 products only from 2850=============================================================================================
app.get('/getProducts', (req, res) => {
    let Query = 'SELECT * FROM products';
    let result1 = [];
    con.query(Query, function (err, result, fields) {
        console.log("results are = " , result)
        result1 = result.slice(1, 400)
        res.send(result1);
    })
})
// ============================================================ Get all users =============================================================================================
app.get('/GetUsers', (req, res) => {
    let Query = 'SELECT * FROM users';
    con.query(Query, function (err, result, fields) {
        res.send(result);
    })
})
// ============================================================ Get all orders =============================================================================================
app.get('/getOrders', (req, res) => {
    let Query = 'SELECT * FROM orders';
    con.query(Query, function (err, result, fields) {
        res.send(result);
    })
})
// =========================================================chcek if user in DB return Admin/not admin============================================================================================
app.post('/CheckLogin', (req, res) => {
    console.log(req.body);
    let found = false;
    let item = {};
    let userInfo = {
        id: "",
        user_name: "",
        mail: "",
        results: "",
        password: "",
    }
    con.query('SELECT * FROM users', function (err, result, fields) {

        for (item of result) { // Check if user exist
            if (item.user_name == req.body.username && item.password == req.body.password) {
                userInfo.id = item.id;
                userInfo.user_name = item.user_name;
                userInfo.mail = item.mail;
                userInfo.password = item.password;

                if (item.role == 1) { // if exist check if Admin
                    found = true;
                    isAdmin = true;
                    console.log("found = ", found)
                    console.log("Admin User")
                    userInfo.results = "Admin User"
                    res.send(JSON.stringify(userInfo));
                }
                if (item.role == 0) { // if exist check if Not Admin
                    found = true;
                    isAdmin = false;
                    console.log("found = ", found)
                    console.log("Not Admin")
                    userInfo.results = "Not Admin"
                    res.send(JSON.stringify(userInfo));
                }
            }
        }
        if (found == false) { // if user Not exist 
            userInfo.results = "NotRegestered"
            console.log("Not Regestered User")
            res.send(JSON.stringify(userInfo));
        }
    })
})
// ====================================================== insert from Regester step 1 page new user ====================================================
app.post('/Regester1', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let mail = req.body.mail;
    con.query(`INSERT INTO users (user_name,mail,password) VALUES ('${username}','${mail}','${password}')`, function (err, result, fields) {
        if (err) throw err;
        res.send();
    })
});
// ====================================================== Bring the new User Id after regester 1 ====================================================
app.post('/BringID', (req, res) => {
    let username = req.body.username;
    let Query = `SELECT id FROM users WHERE user_name='${username}'`;
    con.query(Query, function (err, result, fields) {
        res.send(JSON.stringify(result));
    })
})
// ====================================================== Check if exist Open Order for user====================================================
app.post('/checkOpenOrder', (req, res) => {
    let userid = req.body.uid;
    console.log("userid ====", userid);
    let Query = `SELECT * FROM orders WHERE uid='${userid}' ORDER BY order_started DESC`;
    con.query(Query, function (err, result, fields) {
        // console.log("result ====", result);
        res.send(result);
    })
})
// ====================================================== insert from Regester step 2 page new user ====================================================
app.post('/Regester2', (req, res) => {
    let userid = req.body.userid;
    let city = req.body.city;
    let street = req.body.street;
    let name = req.body.name;
    let lastname = req.body.lastname;
    con.query(`UPDATE users SET city='${city}' , street='${street}', name='${name}' , familyname='${lastname}' WHERE id='${userid}'`, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})
// ============================================================Set New order for user that dont have open order =============================================================================================
app.post('/setOrder', (req, res) => {
    // console.log("req.body", req.body);
    let obj = req.body;
    let Query = `INSERT INTO orders (uid) VALUES (${obj.uid})`;
    con.query(Query, function (err, result, fields) {
        res.send(result);
    })
})
// ======================================================insert product to carts_products table according to Order id=====================================================================================
app.post('/addProductToCart', (req, res) => {
    console.log("addProductToCart === ", req.body);
    let obj = req.body;
    let Query = `INSERT INTO carts_products (productId,orderId,categoryId,image,name,price,quantity,imgChanged) VALUES (${Number(obj.id)},${Number(obj.orderId)},${Number(obj.categoryId)},${JSON.stringify(obj.image)},${JSON.stringify(obj.name)},${Number(obj.price)},${Number(obj.quantity)},${Number(obj.imgChanged)})`;
    con.query(Query, function (err, result, fields) {
        console.log("product added to basket");
        res.send("1");
    })
})
// =======================================================delete product from cart according to prod id and order Id====================================================================================
app.post('/deleteProductFromCart', (req, res) => {
    console.log("Product id to delete : ", req.body);
    let obj = req.body;
    let Query = `DELETE FROM carts_products WHERE productId = ${Number(obj.id)} AND orderId = ${Number(obj.orderId)}`;
    con.query(Query, function (err, result, fields) {
        res.send("1");
    })
})
//=========================================================================Update total =========================================================================
app.post('/UpdateTotalPrice', (req, res) => {
    // console.log("UpdateTotalPrice====", req.body);
    let obj = req.body;
    let Query = `UPDATE orders SET total_price='${obj.sum}'  WHERE order_id = ${Number(obj.Oid)}`;
    con.query(Query, function (err, result, fields) {
        res.send("1");
    })
})
//=========================================================================finish order =========================================================================
app.post('/updateOrder', (req, res) => {
    // console.log(req.body);
    let obj = req.body;
    let Query = `UPDATE orders SET finish = 1 WHERE id = ${Number(obj.orderId)}`;
    con.query(Query, function (err, result, fields) {
        res.send("1");
    })
})
//=========================================================================finish order =========================================================================
app.post('/FinishOrder1', (req, res) => {
    console.log(req.body);
    let obj = req.body;
    let Query = `UPDATE orders SET order_finished='${obj.finish_date}', city='${obj.city}',street='${obj.street}',cradit_card='${Number(obj.payment)}',shipping_date='${obj.shipping_date}', finish = 1  WHERE order_id = ${Number(obj.orderId)}`;
    con.query(Query, function (err, result, fields) {
        res.send("1");
    })
})
app.listen(5000)