const Note = require('../models/Notes')

const insert = (userData) => {
    const notes = new Note(userData)
    return notes.save()
}
const findOne = (where, expand) => {
    if (!expand){
        return Note.findOne(where)
    } 
    return Note.findOne(where)
    .populate({
        path: 'comments',
        populate: {
            path: 'user_id',
            select: 'name username profile_image',
        },
    })
}
const modify = (data, id) => {
    return Note.findByIdAndUpdate(id, data, { new: true })
}
const modifyComment = (data, id) => {
    return Note.findByIdAndUpdate(id, data, { new: true })
}
const removeNote = (id) => {
    return Note.findByIdAndDelete(id, { new: true })
}
const list = (where) => {
    return Note.find(where || {}).populate({
        path: 'user_id',
        select: 'name username email profile_image',
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'user_id',
            select: 'name username profile_image',
        },
    })
    // return Note.find({}).execPopulate("users").then((users) => {  console.log({ users });}).catch((err) => console.log(err));
}

module.exports = { insert, list, modify, removeNote, findOne, modifyComment }
