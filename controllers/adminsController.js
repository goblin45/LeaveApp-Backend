const Admin = require('../models/Admin')
const School = require('../models/School')
const asynchandler = require('express-async-handler')
const bcrypt = require('bcrypt')

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
        return res.status(400).json({ message: 'School not found.' })
    } else if (code !== school.code) {
        return res.status(400).json({ message: 'Institute code didn\'t match.' })
    }

    const duplicate = await Admin.findOne({ id: id, inst_name: inst_name }).lean().exec()
    
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate faculty Id found.' })
    }

    const hashpwd = await bcrypt.hash(password, 10)
    
    const adminObj = {id, name, "password": hashpwd, inst_name }

    const admin = Admin.create(adminObj)

    if (admin) {
        res.status(200).json({ message: `Admin ${name} of institute ${inst_name} created.` })
    } else {
        res.status(400).json({ message: 'Invalid data received.' })
    }
})

//@desc Update admin
//@route PATCH /admins
//@access Private
const updateAdmin = asynchandler(async(req, res) => {
    const { _id, id, name, password, inst_name, code } = req.body

    if (!_id || !id || !name || !password || !inst_name || !code) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const admin = await Admin.findById(_id).exec()

    if (!admin) {
        return res.status(400).json({ message: 'Admin not found.' })
    }

    if (admin.inst_name !== inst_name) {
        const school = await School.findOne({ name: inst_name }).exec()

        if (!school) {
            return res.status(400).json({ message: 'School not found!' })
        }

        if (school.code !== code) {
            return res.status(400).json({ message: 'Code didn\'t match with the new institute name.' })
        } 
    }

    const duplicate = await Admin.findOne({ inst_name: inst_name, id: id })

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate admin found.' })
    }

    const hashpwd = await bcrypt.hash(password, 10)

    if (admin.password.toString() !== hashpwd.toString()) {
        admin.password = hashpwd
    }

    admin.id = id
    admin.name = name
    admin.inst_name = inst_name

    const updatedAdmin = await admin.save()

    if (updatedAdmin) {
        res.status(200).json({ message: `Admin ${admin.name} with Id ${admin._id} updated.`})
    } else {
        res.status(400).json({ message: 'Invalid data received.' })
    }
    
})

//@desc Delete an admins
//@route DELETE /admins
//@access Private
const deleteAdmin = asynchandler(async(req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Admin Id required.' })
    }

    const admin = await Admin.findById(_id).exec()

    if (!admin) {
        return res.status(400).json({ message: 'Admin not found.' })
    }

    const result = await admin.deleteOne()

    if (result) { 
        res.status(200).json({ message: `Admin ${result.name} with Id ${result._id} deleted.` })
    } else {
        res.status(400).json({ message: 'Admin couldn\'t be deleted.' })
    }
})

module.exports = {
    getAllAdmins,
    createNewAdmin,
    updateAdmin,
    deleteAdmin
}