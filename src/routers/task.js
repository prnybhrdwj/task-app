const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const {ObjectID} = require('mongodb')


//task creation API
router.post('/tasks', async (req,res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }


    // task.save().then(() => {
    //     res.status(201).send(task) //status code for created
    // }).catch((e)=> {
    //     res.status(400).send(e)
    // })

})

//fetch all tasks API
router.get('/tasks', async (req, res) => {

    try {
        const task = await Task.find({})
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

    // Task.find({}).then( (task)=> {
    //     res.send(task)
    // }).catch((e)=> {
    //     res.status(500).send()
    // })
})

//fetch one task API
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    if(!ObjectID.isValid(_id)) {
        return res.status(400).send("Use a valid id")
    }

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

    // Task.findById(_id).then((task)=> {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=> {
    //     res.status(500).send()
    // })

} )

//update task API
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        res.status(400).send({error: 'Invalid request'})
    }
    try {
        const task = await Task.findById(req.params.id)

        updates.forEach( (update) => {
            task[update] = req.body[update] //same as dynamically saying task.name(), task.some-key(), etc.
        })

        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete task API
router.delete('/tasks/:id', async(req, res)=> {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})

module.exports = router