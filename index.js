const express = require('express');
const mongoose = require("mongoose");


// models import
const Expense = require('./model/expense')
const Category = require('./model/category')
const Income = require('./model/income')
const Budget = require('./model/budget')
var cors = require('cors')
const authRoute = require('./authroute')
const passportSetup = require("./passport");
const cookieSession = require("cookie-session");
const passport = require("passport");

//utils import
const { test } = require('./utils')
const verify = require('./auth')

const app = express();



app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 5000;

const { commonFunction } = require('./commonmodules');

//------------------------------------ LOGIN ----------------------------------


app.use("/auth", authRoute);



//-----------------------------------  Routes -----------------------------------------
app.all('/expense/:id?', test, function (req, res) {
    commonFunction(req, res, Expense)
})

app.all('/category/:id?', test, function (req, res) {
    commonFunction(req, res, Category)
})

app.all('/income/:id?', test, function (req, res) {
    commonFunction(req, res, Income)
})

app.all('/budget/:id?', test, function (req, res) {
    commonFunction(req, res, Budget)
})
//---------------------------------  Mongo DB Connection-------------------------------

mongoose.connect(process.env.DB_URI)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

//----------------------------------------------------------------------------------------------
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);

