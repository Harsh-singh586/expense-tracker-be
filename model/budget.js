const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
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

const Budget = new mongoose.model('Budget', budgetSchema)

module.exports = Budget