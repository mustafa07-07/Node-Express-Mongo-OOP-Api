const BaseModel = require('../models/Notes')
const BaseService = require('./BaseService')

class NoteService extends BaseService {
    constructor(){
        super(BaseModel)
    }
    list(where) {
        return BaseModel?.find(where || {}).populate({
            path:"user_id",
            select:"name username email profile_image"
        })
    }
    
}
module.exports = new NoteService();
