const express = require('express')
const router = express.Router()
const schoolsController = require('../controllers/schoolsController')

router.route('/')
    .get(schoolsController.getAllSchools)
    .post(schoolsController.createNewSchool)
    .patch(schoolsController.updateSchool)
    .delete(schoolsController.deleteSchool)

module.exports = router