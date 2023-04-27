const Student = require('../models/Student')
const School = require('../models/School')
const Admin = require('../models/Admin')
const Mail = require('../models/Mail')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get one student
//@route POST /students/find
//@access Private
const getStudent = asynchandler(async(req, res) => {
    const { _id } = req.body

    const student = await Student.find({ _id: _id }).lean().exec()

    if (!student?.length) {
        return res.status(400).json({ message: 'No student found with that Id!' })
    }

    res.status(200).json({ id: student[0].id, name: student[0].name, inst_name: student[0].inst_name })
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
        return res.status(409).json({ message: `An account already exists with this Id in ${inst_name}` })
    }

    const hashpwd = await bcrypt.hash(password, 10)

    const studentObj = { id, name, "password": hashpwd, inst_name }

    const student = await Student.create(studentObj)

    if (student) {
        res.status(200).json({ _id: student._id, name: student.name })
    } else {
        res.status(400).json({ message: 'Invalid data received.' })
    }
})

//@desc Update student
//@route PATCH /students
//@access Private
const updateStudent = asynchandler(async(req, res) => {
    const { _id, id, name, password, inst_name } = req.body

    if (!_id || !id || !name || !inst_name) {
        return res.status(400).json({ message: 'All fields are required!' })
    }

    const student = await Student.findById(_id).exec()

    if (!student) {
        return res.status(400).json({ message: 'Account not found!' })
    }

    const school = await School.findOne({ name: inst_name }).exec()

    if (!school) {
        return res.status(400).json({ message: 'Institute not found!' })
    }

    const duplicate = await Student.findOne({ id: id, inst_name: inst_name }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: `An account already exists with this Id in ${inst_name}` })
    }

    if (password?.length) {
        student.password = await bcrypt.hash(password, 10)
    }

    student.id = id
    student.name = name
    student.inst_name = inst_name

    const updatedStudent = await student.save()

    res.json({ name: updatedStudent.name })
})

//@desc Delete student
//@route DELETE /students
//@access Private
const deleteStudent = asynchandler(async(req, res) => {
    const { _id, password } = req.body

    if (!_id || !password) {
        return res.status(400).json({ message: 'Please enter your password to confirm.' })
    }

    const student = await Student.find({ _id: _id }).exec()

    if (!student?.length) {
        return res.status(400).json({ message: 'Account not found!' })
    }

    const match = await bcrypt.compare(password, student[0].password)

    if (!match) {
        return res.json(400).json({ message: "Incorrect password." })
    }

    const mails = await Mail.deleteMany({ sender: student[0]._id })

    const result = await student[0].deleteOne()

    res.status(200).json({ name: result.name })

})

//------------------------------Custom Methods--------------------------------//

//Path POST /students/sameschooladmins 
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

//--------------------------------Not Needed-----------------------------------//

//@desc Get all students
//@route GET /students
//@access Private
const getAllStudents = asynchandler(async(req, res) => {
    const students = await Student.find().select('-password').lean()

    if (!students?.length) {
        return res.status(400).json({ message: 'No students found!'})
    }

    res.json(students)
})

//-----------------------------------------------------------------------------//

module.exports = { 
    getStudent,
    getAllStudents,
    createNewStudent,
    updateStudent,
    deleteStudent,
    getSameSchoolAdmins
}
