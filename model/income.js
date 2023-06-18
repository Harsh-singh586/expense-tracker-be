const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        default: 'other'
    },
    month: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        required: true
    }

})

const Income = new mongoose.model('Income', incomeSchema)

module.exports = Income
