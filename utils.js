const mongoose = require('mongoose')
var AccessToken = require("./model/accesstoken")
const { protectedPath } = require('./settings')

async function getUser(req) {

    // get User by auth token

    var authHeader = req.headers.authorization
    if (!authHeader) {

        return null
    }
    var token = authHeader.split(" ")[1]
    console.log('token--', token)
    var data = await mongoose.model('AccessToken').aggregate([
        {
            "$match": { "accesstoken": token }
        },
        {
            "$lookup": {
                from: "users",
                localField: "userid",
                foreignField: "userId",
                as: "userData"
            }
        }
    ])

    console.log('data --', data)

    if (data.length === 0) {
        return null
    }
    return data[0].userData[0] ?? null
}


async function test(req, res, next) {

    // middleware

    if (!protectedPath.includes(req.path)) {
        next()
        return
    }

    var user = await getUser(req)
    if (!user) {
        res.sendStatus(401)

    }
    else {
        req.user = user.username
        if (req.method === 'GET') {
            req.query.createdBy = user.username
        }
        else if (req.method === 'POST') {
            req.body.createdBy = user.username
        }
        next()
    }
}


function ModifiedData(data, sumField) {

    // modify response by mongo to add total number of record and sum of any field in record

    var sum = 0
    var count = 0

    for (item in data) {
        sum += data[item][sumField]
        count += 1
    }

    data.total = sum
    data.count = count

    var ModifiedData = {
        total: sum,
        count: count,
        data: data
    }

    return ModifiedData

}



module.exports = { getUser, test, ModifiedData }
