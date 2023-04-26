const express = require('express')
const router = express.Router()
const loginsController = require('../controllers/loginsController')

router.route('/students')
    .post(loginsController.getStudentId)

router.route('/admins')
    .post(loginsController.getAdminId)

module.exports = router