const express = require('express')
const validate = require('../middlewares/validate')
const authenticateToken = require('../middlewares/authenticate')
const validations = require('../validations/users')
const UserController = require('../controllers/users')
const router = express.Router()
router.route('/').get(authenticateToken, UserController.index)
router.route('/:id').delete(authenticateToken, UserController.deleteUser)
router.route('/create').post(validate(validations.createValidation), UserController.create)
router.route('/login').post(validate(validations.loginValidation), UserController.login)
router.route('/notes').get(authenticateToken, UserController.noteList)
router.route('/reset-password').post(authenticateToken,validate(validations.resetPasswordValidation),UserController.resetPassword)
router.route('/update-profile-image').post(authenticateToken,validate(validations.profileImageValidation),UserController.updateProfileImage)
router.route('/change-password').patch(authenticateToken,validate(validations.changePasswordValidation),UserController.changePassword)
router.route('/update').patch(authenticateToken,validate(validations.updateValidation),UserController.update)
module.exports = router
