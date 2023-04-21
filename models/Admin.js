const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Admin', adminSchema)