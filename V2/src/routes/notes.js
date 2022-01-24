const express = require('express')
const NoteController= require('../controllers/notes')
const validate = require('../middlewares/validate')
const validations = require('../validations/notes')
const schemas = require('../validations/notes')
const authenticateToken = require('../middlewares/authenticate')
const router = express.Router()
router
.route('/')
.get(authenticateToken, NoteController.index)

router
.route('/:id')
.get(authenticateToken, NoteController.listNote)

router
.route('/:id')
.delete(authenticateToken, NoteController.deleteNote)

router
    .route('/:id/make-comment')
    .post(authenticateToken, validate(schemas.commentValidation), NoteController.makeComment)
router

.route('/:id/:commentId')
.delete(authenticateToken, NoteController.deleteComment)

router
    .route('/update/:id')
    .patch(authenticateToken, validate(schemas.noteValidation), NoteController.update)

router
    .route('/create')
    .post(authenticateToken, validate(validations.noteValidation), NoteController.create)
    
module.exports = router
