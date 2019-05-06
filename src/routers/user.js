const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const {ObjectID} = require('mongodb')



//user creation API
router.post('/users', async (req, res) => { //added async in front of all functions to simplify syntax with await. Now function will return a promise with a value instead of a direct value
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e) 
    } 
    
    // user.save().then(()=> {
    //     res.status(201).send(user) //status code for created
    // }).catch((e)=> {
    //     res.status(400).send(e) //generic error code
    // })
} )

//user login system
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        
        res.send(user)

    } catch (e) {
        res.status(400).send()
    }
})


//fetch all users API
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}) //we had to store response in users variable so that we can send it later
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
    
    // User.find({}).then( (users) => { //get the array with all documents in users collection
    //     res.send(users)
    // }).catch( (e)=> {
    //     res.status(500).send()
    // })
})

//fetch one user API
router.get('/users/:id', async (req, res) => { //we specify :id as the name for whatever params are being sent
    const _id = req.params.id //we use req.params to get hold of all the params being sent. .id gives the exact value. req.params would give an object with id and param as key-value pair
    
    if(!ObjectID.isValid(_id)) {
        return res.status(400).send("Use a valid id") //used to remove cases where parameter is not a valid id
    }

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})
    // User.findById(_id).then( (user)=> { //we need to use if-else because mongo sends success on a complete search even if it matches 0 results
    //     if(!user) { //if user object is empty
    //         return res.status(404).send() //status is not found
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send()
    // })


//update user API
//We want to handle cases for user updated successfully, user update failed and no user to update.
router.patch('/users/:id', async (req, res) => {
    //we will allow users to udpate only specific parameters. goal is to let him know what he can't update
    const updates = Object.keys(req.body) //convert an object into an array with the keys of the object
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update) //this returns a boolean true or false. Everything inside updates should be a sub-set of allowedupdates
    })
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    } 
    try {

        const user = await User.findById(req.params.id)
        updates.forEach((update) => { //update tells the key of the field user wants to update
            user[update] = req.body[update] //square gives dynamic value. square notation is used instead of . notation because we don't what value user is trying to change.
        }) 

        await user.save() //this is where the middleware will be called

        //deprecated becasue findByIdAndUpdate bypasses the middleware, which we need.
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        //new true means update const user with the updated value
        //always run validators when accepting values from user. req.body accepts value from user to update
        if (!user) { //handling for case when user not found
            return res.status(404).send() 
        } 
        res.send(user) //handling for success case
    } catch (e) {
        res.status(400).send() //handling for error case
    }
})

//delete user API
router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)

    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router