const School = require('../models/School')
const Admin = require('../models/Admin')
const asynchandler = require('express-async-handler')

//@desc Create new school
//@route POST /schools
//access Private 
const createNewSchool = asynchandler(async(req, res) => {
    const { name, contact, code } = req.body

    if (!name || !contact || !code) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const duplicate = await School.findOne({ name: name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Institute already exists.' })
    }

    const schoolObj = { name, contact, code }

    const school = await School.create(schoolObj)

    if (school) {
        res.status(200).json({ message: `New Institute ${school.name} created.` })
    }
}) 

//@desc Update a school
//@route PATCH /schools
//access Private 
const updateSchool = asynchandler(async(req, res) => {
    const { _id, name, contact, code } = req.body

    if (!_id || !name || !contact || !code) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    const school = await School.findById(_id).exec()

    if (!school) {
        return res.status(400).json({ message: `No school found with Id ${_id}.` })
    }

    const duplicate = await School.findOne({ name: name }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'This Institute name is already taken.' })
    }

    school.name = name
    school.contact = contact
    school.code = code

    const updatedSchool = await school.save()

    if (updatedSchool) {
        res.status(200).json({ message: `School ${updatedSchool.name} with Id ${updatedSchool._id} updated.` })
    }
})  

//--------------------------------Not Needed-----------------------------------//

//@desc Get all schools
//@route POST /schools
//access Private 
const getAllSchools = asynchandler(async(req, res) => {
    const schools = await School.find().lean().exec()

    if (!schools?.length) {
        return res.status(400).json({ message: 'No school found.' })
    }
    
    res.json(schools)
}) 

//@desc Delete a school
//@route DELETE /schools
//access Private 
const deleteSchool = asynchandler(async(req, res) => {
    const { _id } = req.body
    
    if (!_id) {
        return res.status(400).json({ message: 'Must provide school Id.' })
    }

    const school = await School.findOne({ _id: _id }).exec()

    if (!school) {
        return res.status(200).json({ message: 'No such school found.' })
    }

    const result = await school.deleteOne()

    if (result) {
        res.status(200).json({ message: `School ${result.name} with Id ${result._id} deleted.`})
    } else {
        res.status(400).json({ message: 'Some error occured.' })
    }
})

//-----------------------------------------------------------------------------//

module.exports = {
    getAllSchools,
    createNewSchool,
    updateSchool,
    deleteSchool
}