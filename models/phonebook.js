const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })
//define schema
const personSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength: 3,
        require: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v) && v.length >= 8;
            },
            message: props => `${props.value} is not a valid phone number! Format should be XX-XXXXXXX or XXX-XXXXXXX with total length of at least 8 digits.`
        }
    }
})
//define Model
module.exports = mongoose.model('person', personSchema)