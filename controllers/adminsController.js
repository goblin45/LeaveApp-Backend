const Admin = require('../models/Admin')
const School = require('../models/School')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')


//@desc Get one admin
//@route POST /admins/find
//@access Private
const getAdmin = asynchandler(async(req, res) => {
    const { _id } = req.body

    const admin = await Admin.find({ _id: _id }).exec()

    if (!admin?.length) {
        return res.status(400).json({ message: 'No admin found with that Id!' })
    }

    const school = await School.findOne({ name: admin[0].inst_name }).exec()

    console.log(admin[0])

    res.status(200).json({ id: admin[0].id, name: admin[0].name, inst_name: admin[0].inst_name, code: school.code})
}) 

//@desc Get all admins
//@route GET /admins
//@access Private
const getAllAdmins = asynchandler(async(req, res) => {
    const admins = await Admin.find().select('-password').lean()

    if (!admins?.length) {
        res.status(400).json({ message: 'No Admins found!'})
    }

    res.json(admins)
})

//@desc Create new admin
//@route POST /admins
//@access Private
const createNewAdmin = asynchandler(async(req, res) => {
    const { id, name, password, inst_name, code } = req.body

    if (!id || !name || !password || !inst_name || !code) {
        res.status(400).json({ message: 'All fields are required.' })
    }

    const school = await School.findOne({ name: inst_name }).exec()

    if (!school) {
        return res.status(400).json({ message: 'Institute not found.' })
    } else if (code !== school.code) {
        return res.status(400).json({ message: 'Institute code didn\'t match.' })
    }

    const duplicate = await Admin.findOne({ id: id, inst_name: inst_name }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({ message: `An admin account already exists with this Id in ${inst_name}` })
    }

    const hashpwd = await bcrypt.hash(password, 10)
    
    const adminObj = {id, name, "password": hashpwd, inst_name }

    const admin = await Admin.create(adminObj)

    if (admin) {
        res.status(200).json({ id: admin._id, name: admin.name })
    } else {
        res.status(400).json({ message: 'Invalid data received.' })
    }
})

//@desc Update admin
//@route PATCH /admins
//@access Private
const updateAdmin = asynchandler(async(req, res) => {
    const { _id, id, name, password, inst_name, code } = req.body

    console.log(_id, id, name, password, inst_name, code)

    if (!_id || !id || !name || !password || !inst_name || !code) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const admin = await Admin.find({ _id: _id }).exec()

    if (!admin?.length) {
        return res.status(400).json({ message: 'Admin not found.' })
    }

    console.log(admin)

    const school = await School.findOne({ name: inst_name }).exec()

    if (!school) {
        return res.status(400).json({ message: 'Institute not found!' })
    }

    if (school.code !== code) {
        return res.status(400).json({ message: 'Code didn\'t match with the institute name.' })
    }

    const duplicate = await Admin.findOne({ inst_name: inst_name, id: id })

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: `An admin account already exists with this Id in ${inst_name}` })
    }

    const hashpwd = await bcrypt.hash(password, 10)

    if (admin[0].password.toString() !== hashpwd.toString()) {
        admin[0].password = hashpwd
    }

    admin[0].id = id
    admin[0].name = name
    admin[0].inst_name = inst_name

    const updatedAdmin = await admin[0].save()

    console.log(updatedAdmin)

    if (updatedAdmin) {
        res.status(200).json({ name: updatedAdmin.name })
    } else {
        res.status(400).json({ message: 'Invalid data received.' })
    }
    
})

//@desc Delete an admins
//@route DELETE /admins
//@access Private
const deleteAdmin = asynchandler(async(req, res) => {
    const { _id, password } = req.body

    if (!_id || !password) {
        return res.status(400).json({ message: 'Please enter your password to confirm.' })
    }

    const admin = await Admin.find({ _id: _id }).exec()

    if (!admin?.length) {
        return res.status(400).json({ message: 'Account not found.' })
    }

    const match = await bcrypt.compare(password, admin[0].password)

    if (!match) {
        return res.status(400).json({ message: 'Incorrect Password.' })
    }

    const result = await admin[0].deleteOne()

    res.status(200).json({ name: result.name })
})

module.exports = {
    getAdmin,
    getAllAdmins,
    createNewAdmin,
    updateAdmin,
    deleteAdmin
}