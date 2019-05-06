const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema( { 
    description: {
        type: String,
        required: true,
        trim: true
    }, completed: {
        type: Boolean,
        required: false,
        default: false
    }
} )



const Task = mongoose.model('Task', taskSchema)

module.exports = Task