const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true, 
    useCreateIndex: true
})

// 
// const user1 = new User ({
//     name: 'Pranay     ', 
//     email: 'PrNYBHRdwj@gmail.com',
//     password: 'shutupmofo123)|('
// })

// user1.save().then( () => {
//     console.log(user1)
// }).catch( (error) => {
//     console.log('Error!', error)
// })



// const task2 = new Tasks ({
//     description: 'Running 42kms        ',
//     completed: true
// })

// //this creates a new collection and adds the document
// task2.save().then( () => {
//     console.log(task2)
// }).catch( (error) => {
//     console.log('validation failed: ', error)
// })

