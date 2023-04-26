const Mail = require('../models/Mail')
const Student = require('../models/Student')
const Admin = require('../models/Admin')
const asynchandler = require('express-async-handler')

//@desc Get one mail 
//@path POST /mails/find
//@access Private
const getMail = asynchandler(async(req, res) => {
    const { _id } = req.body

    const mail = await Mail.find({ _id: _id }).exec()

    if (!mail?.length) {
        return res.status(400).status({  })
    }

    console.log(mail)

    res.status(200).json(mail[0])
})

//@desc Create new mail
//@route POST /mails
//@access Private
const createNewMail = asynchandler(async(req, res) => {
    const { subject, days, body, senderId, receiverId } = req.body

    if (!subject || !days || !body || !senderId || !receiverId) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    console.log(receiverId)
    console.log(typeof(body))
    console.log(body)

    if (body.length > 200 ) {
        return res.status(400).json({ message: 'Application body is too long. It must be of within 200 characters.' })
    }

    const sender = await Student.find({ _id: senderId }).exec()

    const receiver = await Admin.find({ _id: receiverId }).exec()

    const mailObj = { subject, days, body, senderId, senderName: sender[0].name, receiverId, receiverName: receiver[0].name}

    const newMail = await Mail.create(mailObj)

    if (newMail) {
        res.status(200).json({ message: `New mail ${newMail.subject} sent to ${newMail.receiverName} from ${newMail.senderName}.` })
    } else {
        res.status(400).json({ message: 'Mail could not be sent.' })
    }
})

//@desc update a mail
//@route PATCH /mails
//@access Private
const updateMail = asynchandler(async(req, res) => {
    const { _id, subject, days, body, receiverId } = req.body

    console.log(_id, subject, days, body, receiverId)
    
    if (!_id || !days || !subject || !body || !receiverId) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const receiver = await Admin.find({ _id: receiverId }).exec()

    const mail = await Mail.find({ _id: _id }).exec()

    if (!mail?.length) {
        return res.status(400).json({ message: 'Mail not found.' })
    }

    mail[0].receiverId = receiverId
    mail[0].receiverName = receiver[0].name
    mail[0].subject = subject
    mail[0].body = body
    mail[0].days = days

    const updatedMail = await mail[0].save()

    if (updatedMail) {
        res.status(200).json({ message: 'Mail Updated.' })
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

    const mails = await Mail.find({ receiverId: _id, status: "Pending" })

    if(!mails?.length) {
        return res.status(200).json({ message: 'No pending mails to show.' })
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
        return res.status(400).json({ message: 'Must provide sender Id.' })
    }

    const mails = await Mail.find({ senderId: senderId, status: "Pending" })

    if(!mails?.length) {
        return res.status(200).json({ message: 'No mails to show.' })
    }

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

    const mails = await Mail.find({ senderId: _id, status: { $in: [ "Granted", "Denied" ] } })

    if (!mails?.length) {
        return res.status(200).json({ message: 'No mails to show.' })
    }

    console.log(mails)

    res.status(200).json(mails)
})

//--------------------------------Not Needed-----------------------------------//

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

//-----------------------------------------------------------------------------//

module.exports = {
    getMail,
    getAllMails,
    createNewMail,
    updateMail,
    deleteMail,
    getReceivedMails,
    updateMailStatus,
    getPendingMails,
    getNonPendingMails
}