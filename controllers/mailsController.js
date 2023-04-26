const Mail = require('../models/Mail')
const Student = require('../models/Student')
const Admin = require('../models/Admin')
const asynchandler = require('express-async-handler')

//@desc Get all mails
//@route GET /mails
//@access Private
const getAllMails = asynchandler(async(req, res) => {
    const mails = await Mail.find().lean().exec()

    if (!mails?.length) {
        return res.status(400).json({ message: 'No Mails found.' })
    }
    res.status(200).json(mails)
})

//@desc Create new mail
//@route POST /mails
//@access Private
const createNewMail = asynchandler(async(req, res) => {
    const { subject, days, body, sender, receiver } = req.body

    if (!subject || !days || !body || !sender || !receiver) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const mailObj = { subject, days, body, sender, receiver }

    const newMail = await Mail.create(mailObj)

    if (newMail) {
        res.status(200).json({ message: `New mail ${newMail.subject} sent to ${newMail.receiver} from ${newMail.sender}.` })
    } else {
        res.status(400).json({ message: 'Mail could not be sent.' })
    }
})

//@desc update a mail
//@route PATCH /mails
//@access Private
const updateMail = asynchandler(async(req, res) => {
    const { _id, subject, days, body, receiver } = req.body
    
    if (!_id || !days || !subject || !body || !receiver) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const mail = await Mail.findById(_id).exec()

    if (!mail) {
        return res.status(400).json({ message: 'Mail not found.' })
    }

    mail.receiver = receiver
    mail.subject = subject
    mail.body = body
    mail.days = days

    const updatedMail = await mail.save()

    if (updatedMail) {
        res.status(200).json({ message: `Mail ${updatedMail.subject} with Id ${updatedMail._id} updated.` })
    } else {
        res.status(400).json({ message: 'Mail couldn\'t be updated.'})
    }
})

//@desc Delete a mail
//@route DELETE /mails
//@access Private
const deleteMail = asynchandler(async(req, res) => {
    const { _id } = req.body

    const mail = await Mail.findById(_id).exec()

    if (!mail) {
        return res.status(400).json({ message: 'No such mail found.' })
    } 

    console.log(mail)

    const result = await mail.deleteOne()

    if (result) {
        res.status(200).json({ message: `Mail ${result.subject} with Id ${result._id} sent to ${result.receiver} by ${result.sender} deleted.` })
    } 
})

//------------------------------Custom Methods--------------------------------//

//@desc Get (pending) mails received by an admin
//@route POST /mails/admins
//@access Private
const getReceivedMails = asynchandler(async(req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Must provide receiver Id.' })
    }

    const mails = await Mail.find({ receiver: _id, status: "pending" })

    if(!mails?.length) {
        return res.status(400).json({ message: 'No pending mails to show.' })
    }

    console.log(mails)

    res.status(200).json(mails)
})

//@desc Update status of a mail
//@route PATCH /mails/admins
//@access Private
const updateMailStatus = asynchandler(async(req, res) => {
    const { _id, status } = req.body

    console.log(_id, status)

    if (!_id || !status) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const mail = await Mail.findById(_id).exec()

    if(!mail) {
        return res.status(400).json({ message: 'No such mail found.' })
    }

    mail.status = status

    const updatedMail = await mail.save()

    if (!updatedMail) {
        res.status(400).json({ message: 'Some error occured.' })
    } else {
        res.status(200).json({ message: `Status of mail with id ${updatedMail._id} was changed to ${status}.`})
    }
})

//@desc Get pending mails of a student
//@route GET /students/pending
//@access Private
const getPendingMails = asynchandler(async(req, res) => {
    const { senderId } = req.body

    if (!senderId) {
        return res.status(410).json({ message: 'Must provide sender Id.' })
    }

    console.log("check 1")

    const mails = await Mail.find({ sender: senderId, status: "pending" })

    console.log("check 2")

    if(!mails?.length) {
        return res.status(400).json({ message: 'No mails to show.' })
    }
    
    console.log(mails)

    res.status(200).json(mails)
})

//@desc Get non-pending mails of a student
//@route GET /students/nonpending
//@access Private 
const getNonPendingMails = asynchandler(async(req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Must provide sender Id.' })
    }

    const mails = await Mail.find({ sender: _id, status: "granted", status: "denied" })

    if (!mails?.length) {
        return res.status(400).json({ message: 'No mails to show.' })
    }

    res.status(200).json(mails)
})


module.exports = {
    getAllMails,
    createNewMail,
    updateMail,
    deleteMail,
    getReceivedMails,
    updateMailStatus,
    getPendingMails,
    getNonPendingMails
}