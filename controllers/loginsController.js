const asynchandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Student = require('../models/Student')
const bcrypt = require('bcrypt')

const getStudentId = asynchandler(async(req, res) => {
    const { id, password } = req.body

    if (!id || !password) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const student = await Student.findOne({ id: id }).exec()

    if (!student) {
        return res.status(400).json({ message: 'Account not found.' })
    }

    const match = await bcrypt.compare(password, student.password)

    if (!match) {
        return res.status(400).json({ message: 'Password didn\'t match.' })
    }

    console.log(student._id)

    res.status(200).json({ id: student._id, name: student.name })
})

const getAdminId = asynchandler(async(req, res) => {
    const { id, password } = req.body

    if (!id || !password) {
        return res.status(400).json({ message: 'All fields are required.'})
    }

    const admin = await Admin.findOne({ id: id }).exec()

    if (!admin) {
        return res.status(400).json({ message: 'Account not found.' })
    }

    const match = await bcrypt.compare(password, admin.password)

    if (!match) {
        return res.status(400).json({ message: 'Password didn\'t match.' })
    }

    res.status(200).json({ id: admin._id, name: admin.name})
})

module.exports = {
    getStudentId, getAdminId
}