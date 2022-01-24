const express = require('express')
const {
    create,
    index,
    update,
    deleteNote,
    makeComment,
    deleteComment,
    updateComment,
    listNote
} = require('../controllers/notes')
const validate = require('../middlewares/validate')
const validations = require('../validations/notes')
const schemas = require('../validations/notes')
const authenticateToken = require('../middlewares/authenticate')
const router = express.Router()
router.route('/').get(authenticateToken, index)
router.route('/:id').get(authenticateToken, listNote)
router.route('/:id').delete(authenticateToken, deleteNote)
router
    .route('/:id/make-comment')
    .post(authenticateToken, validate(schemas.commentValidation), makeComment)
router.route('/:id/:commentId').delete(authenticateToken, deleteComment)
router.route('/:id/:commentId').patch(authenticateToken, updateComment)
router
    .route('/update/:id')
    .patch(authenticateToken, validate(schemas.noteValidation), update)
router
    .route('/create')
    .post(authenticateToken, validate(validations.noteValidation), create)
module.exports = router
