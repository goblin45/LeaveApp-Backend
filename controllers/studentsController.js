const Student = require('../models/Student')
const School = require('../models/School')
const Admin = require('../models/Admin')
const Mail = require('../models/Mail')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all students
//@route GET /students
//@access Private
const getAllStudents = asynchandler(async(req, res) => {
    const students = await Student.find().select('-password').lean()

    if (!students?.length) {
        return res.status(400).json({ message: 'No students found!' })
    }
    res.json(students)
})

//@desc Create new user
//@route POST /students
//@access Private
const createNewStudent = asynchandler(async(req, res) => {
    const { id, name, password, inst_name } = req.body

    if (!id || !name || !password || !inst_name) {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    const school = await School.findOne({ name: inst_name }).lean().exec()

    if(!school) {
        return res.status(400).json({ message: `School ${inst_name} was not found.` })
    }

    const duplicate = await Student.findOne({ id }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Account already exists.' })
    }

    const hashpwd = await bcrypt.hash(password, 10)

    const studentObj = { id, name, "password": hashpwd, inst_name }

    const student = await Student.create(studentObj)

    if (student) {
        res.status(201).json({ message: `New student ${name} created.`})
    } else {
        res.status(400).json({ message: 'Invalid data received.' })
    }
})

//@desc Update student
//@route PATCH /students
//@access Private
const updateStudent = asynchandler(async(req, res) => {
    const { _id, id, name, password, inst_name } = req.body

    if (!_id || !id || !name || !password || !inst_name) {
        return res.status(400).json({ message: 'All fields required!' })
    }

    const student = await Student.findById(_id).exec()

    if (!student) {
        return res.status(400).json({ message: 'Student not found!' })
    }

    const school = await School.findOne({ name: inst_name }).exec()

    if (!school) {
        return res.status(400).json({ message: 'School not found!' })
    }

    const duplicate = await Student.findOne({ id: id, inst_name: inst_name }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate Id found!' })
    }

    if (password) {
        student.password = await bcrypt.hash(password, 10)
    }

    student.id = id
    student.name = name
    student.inst_name = inst_name

    const updatedStudent = await student.save()

    res.json({ message: `${updatedStudent.name} updated`})
})

//@desc Delete student
//@route DELETE /students
//@access Private
const deleteStudent = asynchandler(async(req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'User Id required.' })
    }

    const student = await Student.findById(_id).exec()

    if (!student) {
        return res.status(400).json({ message: 'Student not found!' })
    }

    const mails = await Mail.deleteMany({ sender: student._id })

    //delete all the mails sent by this student


    if (!mails) {
        console.log('Student had no mails.')
    } else {
        console.log('All mails of this student are deleted.')
    }

    const result = await student.deleteOne()

    res.status(200).json(`Student ${student.name} with Id ${result._id} deleted.`)

})

const getSameSchoolAdmins = asynchandler(async(req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Must provide Student Id.' })
    }

    const student = await Student.findById(_id).exec()

    if (!student) {
        return res.status(400).json({ message: 'No such student found.' })
    }
 
    const admins = await Admin.find({ inst_name: student.inst_name })

    if (!admins?.length) {
        return res.status(400).json({ message: 'No admin found.' })
    }

    res.status(200).json(admins)
})

module.exports = { 
    getAllStudents,
    createNewStudent,
    updateStudent,
    deleteStudent,
    getSameSchoolAdmins
}