const express = require('express')
const router = express.Router()
const studentsController = require('../controllers/studentsController')

router.route('/')
    .get(studentsController.getAllStudents)
    .post(studentsController.createNewStudent)
    .patch(studentsController.updateStudent)
    .delete(studentsController.deleteStudent)

router.route('/sameschooladmins')
    .post(studentsController.getSameSchoolAdmins)

router.route('/find')
    .post(studentsController.getStudent)

module.exports = router