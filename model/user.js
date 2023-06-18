const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profile_picture: {
        type: String
    }
});

const User = new mongoose.model("User", userSchema);

module.exports = User