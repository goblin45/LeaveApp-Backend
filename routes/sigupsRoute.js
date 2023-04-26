const express = require('express')
const router = express.Router()
const signupsController = require('../controllers/signupsController')

router.route('/students')
    .post(signupsController.getStudentId)

router.route('./admins')
    .post(signupsController.getAdminId)

