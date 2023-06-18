const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
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
    year: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    createdOn: {
        type: Date
    },
    createdTime: {
        type: Date
    },
    createdBy: {
        type: String,
        required: true
    }

})

const Expense = new mongoose.model('Expense', expenseSchema)

module.exports = Expense