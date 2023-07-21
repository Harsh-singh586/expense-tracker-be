const { OAuth2Client } = require('google-auth-library');
const User = require('./model/user')
const crypto = require('crypto')
const AccessToken = require('./model/accesstoken')
const fetch = require("node-fetch");

const CLIENT_ID = "sample_client"
const client = new OAuth2Client(CLIENT_ID);

function addAccessToken(userid) {
    var token = crypto.randomBytes(64).toString('hex');

    var accessToken = {
        accesstoken: token,
        userid: userid
    }

    try {
        var accesstoken = new AccessToken(accessToken)
        var data = accesstoken.save()
        return data
    }
    catch (err) {
        console.log("err saving accesstoken")
        return null
    }
}

async function getOrCreateUser(token, profile) {
    var user = await User.findOne({ userId: profile['sub'] })
    if (!user) {

        var userDetail = profile
        var userdata = {
            userId: userDetail['sub'],
            username: userDetail['email'].split('@')[0],
            name: userDetail['name'],
            email: userDetail['email'],
            profile_picture: userDetail['picture']
        }
        var user = new User(userdata)
        await user.save()

    }
    return user

}


async function verify(req, res) {
    var token = req.body.token
    if (!token) {
        res.sendStatus(401)
        return
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        getOrCreateUser(token, payload, res)


    }
    catch (err) {
        res.sendStatus(401)

    }

}

module.exports = getOrCreateUser