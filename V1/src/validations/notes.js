const Joi = require('joi')
const noteValidation = Joi.object({
    note: Joi.string().required().min(3),
})
const commentValidation = Joi.object({
    comment: Joi.string().required().min(3),
})

module.exports = {
    noteValidation,
    commentValidation
    
}
