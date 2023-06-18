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
    catch {
        return null
    }
}

async function getOrCreateUser(token, profile, res) {
    var user = await User.findOne({ userId: profile['sub'] })
    if (!user) {
        var url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
        try {
            var userres = await fetch(url)
            var userDetail = await userres.json()
            console.log(userDetail)
            var userdata = {
                userId: userDetail['sub'],
                username: userDetail['email'].split('@')[0],
                name: userDetail['name'],
                email: userDetail['email'],
                profile_picture: userDetail['picture']
            }
            var user = new User(userdata)
            try {
                await user.save()
            }
            catch (error) {
                res.sendStatus(400)
                return
            }
        }
        catch (err) {
            res.sendStatus(401)
            return
        }



    }

    var data = await addAccessToken(profile['sub'])
    if (data) {
        var responseData = {
            token: data['accesstoken'],
            username: user['username'],
            name: user['name'],
            email: user['email'],
            profile_picture: user['profile_picture']
        }
        res.send(responseData)
    }


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

        console.log('userid', userid)

        getOrCreateUser(token, payload, res)


    }
    catch (err) {
        console.log('eror1')
        res.sendStatus(401)

    }

}

module.exports = verify