
const BaseModel = require('../models/Users')
const BaseService = require('./BaseService')

class UserService extends BaseService {
    constructor(){
        super(BaseModel)
    }
     list(where) {
        return BaseModel?.find(where || {})
    }
     loginUser = (loginData) => {
        return BaseModel.findOne(loginData)
    }
     
    
}
module.exports = new UserService();
