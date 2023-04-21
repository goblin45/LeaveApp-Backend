const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true
        },
        days: {
            type: Number,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
        status: {
            type: String,
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Mail', mailSchema)