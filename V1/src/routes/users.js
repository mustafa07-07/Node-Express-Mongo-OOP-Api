const express = require('express')
const validate = require('../middlewares/validate')
const authenticateToken = require('../middlewares/authenticate')
const validations = require('../validations/users')
const {
    create,
    index,
    login,
    noteList,
    resetPassword,
    update,
    deleteUser,
    changePassword,
    updateProfileImage,
} = require('../controllers/users')
const router = express.Router()
router.route('/').get(authenticateToken, index)
router.route('/:id').delete(authenticateToken, deleteUser)
router.route('/create').post(validate(validations.createValidation), create)
router.route('/login').post(validate(validations.loginValidation), login)
router.route('/notes').get(authenticateToken, noteList)
//router.route('/').patch(authenticateToken, update)
router
    .route('/reset-password')
    .post(
        authenticateToken,
        validate(validations.resetPasswordValidation),
        resetPassword
    )
router
    .route('/update-profile-image')
    .post(
        authenticateToken,
        validate(validations.profileImageValidation),
        updateProfileImage
    )
router
    .route('/change-password')
    .patch(
        authenticateToken,
        validate(validations.changePasswordValidation),
        changePassword
    )
router
    .route('/update')
    .patch(authenticateToken, validate(validations.updateValidation), update)
//router.route('/updatepass').patch(authenticateToken,validate(validations.changePasswordValidation), changePassword)
module.exports = router
