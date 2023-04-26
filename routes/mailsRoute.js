const express = require('express')
const router = express.Router()
const mailsController = require('../controllers/mailsController')

router.route('/')
    .get(mailsController.getAllMails)
    .post(mailsController.createNewMail)
    .patch(mailsController.updateMail)
    .delete(mailsController.deleteMail)

router.route('/find')
    .post(mailsController.getMail)

router.route('/admins')
    .post(mailsController.getReceivedMails)
    .patch(mailsController.updateMailStatus)

router.route('/students/pending')
    .post(mailsController.getPendingMails)
    
router.route('/students/nonpending')
    .post(mailsController.getNonPendingMails)

module.exports = router