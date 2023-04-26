const express = require('express')
const router = express.Router()
const adminsController = require('../controllers/adminsController')

router.route('/')
    .get(adminsController.getAllAdmins)
    .post(adminsController.createNewAdmin)
    .patch(adminsController.updateAdmin)
    .delete(adminsController.deleteAdmin)

router.route('/find')
    .post(adminsController.getAdmin)

module.exports = router