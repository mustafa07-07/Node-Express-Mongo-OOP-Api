const httpStatus = require("http-status");
const { object } = require("joi");
const logger = require("../scripts/logger/users")

const validate = (schema) => (req, res, next) =>{
  const { value, error } = schema.validate(req.body);
  if (error) {
    const errorMsg = error.details?.map((detail) => detail.message).join(", ");
    res.status(httpStatus.BAD_REQUEST).send({ error: errorMsg });
    logger.log({
        level: 'error',
        message: errorMsg,
    })
    return;
  }
  Object.assign(req, value);
  return next();
};
module.exports=validate;