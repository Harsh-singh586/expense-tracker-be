const express = require('express');
const mongoose = require("mongoose");


// models import
const Expense = require('./model/expense')
const Category = require('./model/category')
const Income = require('./model/income')
const Budget = require('./model/budget')
var cors = require('cors')

//utils import
const { test } = require('./utils')
const verify = require('./auth')

const app = express();

const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Headers`, `Authorization`);
    next();
};

app.use(cors())
app.use(allowCrossDomain)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const PORT = 3001;

const { commonFunction } = require('./commonmodules');

//------------------------------------ LOGIN ----------------------------------


app.post('/login', function (req, res) {
    verify(req, res)
})


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

mongoose.connect('mongodb://root:rootpassword@localhost:27017/testlearn')

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

