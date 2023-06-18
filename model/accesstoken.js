const mongoose = require("mongoose");

const accessTokenSchema = new mongoose.Schema({
    accesstoken: {
        type: String,
        required: true,
        unique: true,
    },
    userid: {
        type: String,
        required: true,
    },
});

const AccessToken = mongoose.model("AccessToken", accessTokenSchema)

module.exports = AccessToken