const User = require('../models/Users')

const insert = (userData) => {
    const users = new User(userData)
    return users.save()
}
const removeUser = (id) => {
    return User.findByIdAndDelete(id, { new: true })
}
const loginUser = (loginData) => {
    return User.findOne(loginData)
}

const list = () => {
    return User.find()
}
const modify=(where,data)=>{
    console.log(data);
    return User.findByIdAndUpdate(where,data,{new:true});
}
module.exports = { insert, list, loginUser,modify ,removeUser}
