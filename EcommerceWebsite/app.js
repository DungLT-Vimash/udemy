const express = require("express");
const bodyPaser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const port = 3000;
const findOrCreate = require("mongoose-findorcreate");
var passport = require('passport');
const app = express();

app.set("view engine", "ejs");


// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));
app.use(bodyPaser.urlencoded({ extended: true }));

// required for passport
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session


// mongoose.connect("mongodb://localhost:27017/CommerciaDB",{useNewUrlParser: true});
mongoose.connect("mongodb://localhost:27017/CommerciaDB");

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex',true);
const brandSchema = new mongoose.Schema({
    brand: String,
    categories: [String],
    img: String,
})


const categorySchema = new mongoose.Schema({
    category: String,
    brands: [String],
    img: String,
})

const emailSchema = new mongoose.Schema({
    email: String,
})

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    imgUrl: String,
    brand: String,
    category: String,
    size: String,
    price: Number,
    quantity: Number,
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    number: Number,
    name: String,
    orders: [
        {
            received: { type: Boolean, default: false },
            checked: { type: Boolean, default: false },
            items: [
                {
                    img: String,
                    title: String,
                    price: Number,
                    qty: Number,
                    size: String,
                }
            ],
            total: String,
            date: String,
        }
    ],
    address: {
        addrs: String,
        city: String,
        tel: Number
    }
});

const bestSellerSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    },
    name: String,
    img: String,
});
// create collection
const Item = new mongoose.model("Item", itemSchema);
const Email = new mongoose.model("Email", emailSchema);
const BestSeller = new mongoose.model("BestSeller", bestSellerSchema);
const Brand = new mongoose.model("Brand", brandSchema);
const User = new mongoose.model("User", userSchema);
const Category = new mongoose.model("Category", categorySchema);

const b1 = new BestSeller({
    name: "Johnson",
    image: "../images/Johnson.jpg"
})
const b2 = new BestSeller({
    name: "Colgate",
    image: "../images/teeth.jpg"
})
const b3 = new BestSeller({
    name: "deodarant",
    image: "../images/deodarant.jpg"
})

const brand1 = new Brand({
    brand: "Johnson",
    categories: ["Shampoo", "body-care", "deodarant"],
    img: "../images/Johnson.jpg"
})
const brand2 = new Brand({
    brand: "Colgate",
    categories: ["vaseline"],
    img: "../images/teeth.jpg"
})
const brand3 = new Brand({
    brand: "Johnson",
    categories: ["body-care"],
    img: "../images/bodycare.jpg"
})
const categ1 = new Category({
    category: "Shampoo",
    brands: ["Johnson", "dove"],
    img: "../images/Johnson.jpg"
})
const categ2 = new Category({
    category: "body care",
    brands: ["vaseline"],
    img: "../images/Johnson.jpg"
})
const categ3 = new Category({
    category: "teeth",
    brands: ["Colgate"],
    img: "../images/Johnson.jpg"
})



const item1 = new Item({
    title: "Baby Johnson",
    description: "This is Baby Johnson",
    imgUrl: "../images/Johnson.jpg",
    brand: "Johnson",
    category: "Shampoo",
    size: "100ML",
    price: "8",
    quantity: 50
})
const item2 = new Item({
    title: "Dove Shampoo",
    description: "This is Baby Johnson",
    imgUrl: "../images/Johnson.jpg",
    brand: "Dove",
    category: "Shampoo",
    size: "100ML",
    price: "8",
    quantity: 50
})
const item3 = new Item({
    title: "Body Care Johnson",
    description: "This is Baby Johnson",
    imgUrl: "../images/Johnson.jpg",
    brand: "Johnson",
    category: "Body Care",
    size: "100ML",
    price: "8",
    quantity: 50
})
const item4 = new Item({
    title: "Body Care Johnson",
    description: "This is Baby Johnson",
    imgUrl: "../images/Johnson.jpg",
    brand: "Johnson",
    category: "Body Care",
    size: "100ML",
    price: "8",
    quantity: 50
})
const item5 = new Item({
    title: "Body Care Johnson",
    description: "This is Baby Johnson",
    imgUrl: "../images/Johnson.jpg",
    brand: "Johnson",
    category: "Body Care",
    size: "100ML",
    price: "8",
    quantity: 50
})

// BestSeller.insertMany([b1, b2, b3],function(err){
//     if(err)console.log(err)
//     else console.log([b1, b2, b3])
// })
// Item.insertMany([item1, item2, item3, item4, item5],function(err){
//     if(err)console.log(err)
//     else console.log([item1, item2, item3, item4, item5])
// })

// Category.insertMany([categ1,categ2,categ3],function(err){
//     if(err)console.log(err);
//     else console.log([categ1,categ2,categ3]);
// })
// Brand.insertMany([brand1,brand2,brand3], function(err){
//     if(err)console.log(err);
//     else console.log([brand1,brand2,brand3]);
// })  

app.get("/", function (req, res) {
    Brand.find({}, function (err, foundBrand) {
        if (!err) {
            BestSeller.find({}, function (err, foundBest) {
                if (!err) {
                    Category.find({}, function (err, foundCat) {
                        res.render("home", { categoriess: foundCat, req: req, brandss: foundBrand, best: foundBest })
                    })
                }else console.log(err)
            })
        }else res.render("home")
    })
})

app.post("/signin",function(req,res){
    const user = new User({
        username: req.body.username
    })
    req.login(user,function(err){
        if(err) console.log(err)
        else{
            passport.authenticate("local",{failureRedirect: "/signinFail"})(res,req,function(){
                res.redirect("/")
            })
        }
    })
})
app.get("/signout",function(req,res){
    req.logout()
    res.redirect("/")
})
app.get("/signinFail",function(req,res){
    res.render("signinFail",{req: req})
})

app.get("/about", function (req, res) {
    res.render("about.ejs", { req: req })
})

app.get("/feedback", function (req, res) {
    res.render("contact.ejs", { req: req })
})

app.get("/category", function (req, res) {
    Category.find({}, function (err, found) {
        if (!err) {
            res.render("category.ejs", { categoriess: found, req: req })
        } else {
            console.log(err);
        }
    })
})

app.post('/category', function (req, res) {
    let category = req.body.categoryname;
    if (category.length > 1) {
        category = category.charAt(0).toUpperCase() + category.slice(1);
    }
    Category.find({ category: category }, function (err, found) {
        if (found != null) {
            const categories = found;
            console.log(categories);
            res.render("category", { categoriess: categories, req: req });
        } else res.render("category", { categoriess: [], req: req })
    })
})
app.post("/brands", function (req, res) {
    let brand = req.body.brandname;
    if (brand.length > 1)
        brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    Brand.find({ brand: brand }, function (err, found) {
        if (found != null) {
            const brands = found;
            console.log(brands);
            res.render("brand.ejs", { brands: foundBrands, req: req });
        } else {
            res.render("brand.ejs", { brands: [], req: req });
        }
    })
})

app.get("/brands", function (req, res) {
    Brand.find({}, function (err, foundBrands) {
        if (err) console.log(err);
        else {
            res.render("brand.ejs", { brands: foundBrands, req: req });
        }
    })
})

app.post("/contact", function (req, res) {
    if (req.isAuthenticated()) {
        User.updateOne({ _id: req.user.id }, {
            message: newMessage
        }), function (err) {
            if (err) console.log(err);
            else console.log("Message Received");
            res.redirect("/");
        }
    } else {
        const newUser = new User({
            name: req.user.txtName,
            email: req.user.txtEmail,
            number: req.user.txtPhone,
            message: req.body.txtMsg
        });
        newUser.save();
        res.redirect("/")
    }
})

app.post("/products", function (req, res) {
    category = req.body.category;

    Item.find({ category: category }, function (err, foundItems) {
        if (!err) {
            if (foundItems != null) {
                res.render("products", { items: foundItems, req: req })
            }
        }
    })
})
app.post("/productsBrands", function (req, res) {
    brand = req.body.brand;
    console.log(brand)
    Item.find({ brand: brand }, function (err, foundItems) {
        if (!err) {
            if (foundItems != null) {
                console.log(foundItems)
                res.render('products', { items: foundItems, req: req })
            }
        }
    })
})

app.get("/productOfBrand", function (req, res) {
    const custom = req.body.name;
    Item.find({ title: custom }, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Items Found: " + foundItems)
                res.render("product", { req: req, item: foundItems })
            } else {
                console.log('no item found')
                res.redirect("/")
                res.render("product", { req: req })
            }
        } else {
            console.log("error" + err)
        }
    })
})
app.post("/productOfBest", function (req, res) {
    const name = req.body.name;
    console.log(name)
    Item.find({ title: name }, function (err, found) {
        if (!err) {
            if (found) res.render("product", { req: req, item: found })
        }
    })
})
app.get("/productOfCategory", function (req, res) {
    const custom = req.body.name;
    Item.find({ title: custom }, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Items Found: " + foundItems)
                res.render("product", { req: req, item: foundItems })
            } else {
                console.log('no item found')
                res.redirect("/")
            }
        } else {
            console.log("error" + err)
        }
    })
})

app.get("/products/:custom", function (req, res) {
    const custom = req.params.custom;

    Item.findById(custom, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Item Found: " + foundItems)
                res.render("product", { req: req, item: foundItems })
            } else {
                res.redirect("/")
            }
        } else {
            console.log(err)
        }
    })
})

app.post("/shipping", function (res, req) {
    const create_at = new Date().toLocaleString();
    const box = req.body.box;
    const size = req.body.size;
    const img = req.body.img;
    const title = req.body.title;
    const price = req.body.price;
    let checked = false;
    let s = false;
    if (req.user.orders.length == 0) {
        s = true
    }
    if (req.user.orders.length > 0) {
        checked = req.user.orders[0].checkout;
    }
    if (s || checked) {
        User.findByIdAndUpdate(req.user.id, {
            $push: {
                'orders': {
                    $each: [{
                        'items': {
                            'img': img,
                            'title': title,
                            'price': price,
                            'qty': box,
                            'size': size
                        }
                    }],
                    $position: 0
                }
            }
        })
    } else {
        User.findByIdAndUpdate(req.user.id, {
            $push: {
                'orders.$[ele].items': {
                    'img': img,
                    'title': title,
                    'price': price,
                    'qty': box,
                    'size': size
                },
            }
        },{
            arrayFilters:[{"ele.checkout": false}]
        })
    }
    if(req.user.address.addrs== null){
        res.render("shipping-cart",{req: req, address: req.user.address})
    }else{
        res.render("/cart")
    }
})

app.get("/shipping",function(req,res){
    res.render("shipping-card",{req: req,address: req.user.address})
})
app.get("/payment",function(req,res){
    res.render("payment-card",{req: req})
})
app.post("/payment",function(req,res){
    const tel = req.body.number;
    const add = req.body.address;
    const city = req.body.city;
    const id = req.user.id;
    User.findByIdAndUpdate(id,{$set: {'address.addrs':add,'address.tel':tel,'address.city':city}},function(err){
        if(err)console.log(err)
        else console.log("There is no error: "+req.user.address)
    })
    res.render("payment-card",{req:req})
})

app.post("/cart",function(req,res){
    User.findById(res.user.id,function(err,user){
        if(err) console.log(err)
        else{
            const orders = user.oders;
            const order= order[0];
            if(req.user.address.addrs==null){
                res.render("shipping-cart",{req:req,address: req.user.address});
            }
            else{
                res.render("place-order",{req:req,items:order.items,order:order,orders:orders})
            }
        }
    })
})



app.post("/stayConnected", function (req, res) {
    const email = new Email({
        email: req.body.email
    })
    Email.create(email, function (error) {
        if (error) console.log(error)
        else console.log("email is added")
    });
    res.redirect("/");
})

app.listen(port, function () {
    console.log("Server started at port 3000")
});