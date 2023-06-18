const { ModifiedData, paginate } = require('./utils')
const { defaultStart, defaultLimit } = require('./settings')

async function commonFunction(req, res, Model) {
    debugger


    if (req.method === 'GET') {


        //  Handle GET request

        const id = req.params.id
        var filter = req.query
        var limit = defaultLimit
        var start = defaultStart
        console.log(defaultStart)
        if (id) {
            try {
                filter['_id'] = id
                const data = await Model.find(filter)
                res.send(data)
            }
            catch {
                res.status(500).send(error)
            }
        }
        else {
            var sumField = null
            var groupSum = null
            var sortMap = { asc: 1, desc: -1 }
            var sortParam = {}
            if ('month' in filter) {
                filter.month = parseInt(filter.month)
            }
            if ('limit' in filter) {
                limit = filter.limit
                delete filter.limit
            }
            if ('start' in filter) {
                start = filter.start
                delete filter.start
            }
            if ('sumField' in filter) {
                sumField = filter.sumField
                delete filter.sumField
            }
            if ('match' in filter) {
                matchField = filter.match
                delete filter.match
            }
            if ('sort' in filter) {
                var sortField = filter.sort
                var sortMethod = filter.sortMethod ?? "asc"
                sortParam[sortField] = sortMap[sortMethod]
                console.log('--', sortField)
                delete filter.sort
                delete filter.sortMethod
            }
            else {
                sortParam["_id"] = 1
            }
            if ('groupSum' in filter) {
                try {
                    groupSum = filter.groupSum
                    delete filter.groupSum
                    console.log('ss---', sortParam)
                    data = await Model.aggregate([{ $match: filter }, { $group: { _id: `$${groupSum}`, amount: { $sum: "$amount" } } }, { $sort: sortParam }])
                    data = paginate({ data: data }, start, limit)
                    res.send(data)
                    return
                }
                catch (e) {
                    console.log('err', e)
                    res.send(400)
                    return
                }
            }
            console.log('ss', sortParam)
            var data = await Model.find(filter).sort(sortParam)
            if (sumField) {
                data = ModifiedData(data, sumField)
                data = await paginate(data, start, limit)
            }
            else {
                data = { data: data }
                data = paginate(data, start, limit)
            }
            res.send(data)
        }

    }
    else if (req.method === 'POST') {

        //  Handle POST request
        const data = new Model(req.body)
        try {
            await data.save();
            res.send(data);
        } catch (error) {
            res.status(500).send(error);
        }
    }
    else if (req.method === 'DELETE') {

        //  Handle DELETE request

        const id = req.params.id
        if (id) {
            try {
                await Model.findByIdAndDelete(id)
                res.send('Item Deleted')
            }
            catch {
                res.status(500).send(error)
            }
        }
        else {
            res.send('Id needed')
        }
    }

}

module.exports = { commonFunction }

