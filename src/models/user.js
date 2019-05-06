const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        required: true, 
        unique: true, //users need to have unique emails. Drop the existing database for this to work if it was not started at the beginning
        lowercase: true,
        trim: true,
        validate(value) { 
            if (!validator.isEmail(value)) {
                throw new Error('email not valid')
            }
        } 
    }, age: {
        type: Number, 
        default: 0,
        validate(value) {
            if (value <0) {
                throw new Error ('Enter a valid age')
            }

        }
    }, password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('You can not use the word password in your password')
            }
        }
    }
} )

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email})

    if (!user) {
        throw new Error ('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error ('Unable to login')
    }

    return user
}

//Hash the plain text password before saving
userSchema.pre('save', async function (next) { 

    if (this.isModified('password')) { //this captures the document we are trying to modify. isModified checks if given field was modified. It returns true or false
        this.password = await bcrypt.hash(this.password, 8) //8 is the recommended # times. We give new value to the password field which is hash of the new password set by user
    }

    next() //if next is not called at the end then we never move to the next operation so we always call it at the end
})

const User = mongoose.model( 'User', userSchema)

module.exports = User
