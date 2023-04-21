const mongoose = require('mongoose')

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('School', schoolSchema)