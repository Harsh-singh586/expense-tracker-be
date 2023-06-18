const { ModifiedData } = require('./utils')

async function commonFunction(req, res, Model) {


    if (req.method === 'GET') {


        //  Handle GET request

        const id = req.params.id
        var filter = req.query
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
            if ('sumField' in filter) {
                sumField = filter.sumField
                delete filter.sumField
            }
            else if ('groupSum' in filter) {
                groupSum = filter.groupSum
                data = await Model.aggregate([{ $group: { _id: `$${groupSum}`, amount: { $sum: "$amount" } } }])
                res.send(data)
                return
            }
            var data = await Model.find(filter)
            if (sumField) {
                data = ModifiedData(data, sumField)
            }
            else {
                data = { data: data }
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
