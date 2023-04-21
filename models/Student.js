const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    inst_name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Student', studentSchema)