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
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
        senderName: {
            type: String
        },
        receiverName: {
            type: String
        },
        status: {
            type: String,
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Mail', mailSchema)