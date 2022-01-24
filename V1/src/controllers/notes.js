const {
    insert,
    modify,
    list,
    removeNote,
    findOne,
    modifyComment,
} = require('../services/notes')
const httpStatus = require('http-status')

const create = (req, res) => {
    // console.log(req.body.password,cryptedPassword);
    req.body.user_id = req.user
    insert(req.body)
        .then((response) => {
            res.status(httpStatus.CREATED).json(response)
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        })
}
const makeComment = (req, res) => {
    findOne({ _id: req.params.id }).then((mainNote) => {
        if (!mainNote)
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: 'Böyle bir not bulunmamaktadır' })
        const comment = {
            ...req.body,
            commented_at: new Date(),
            user_id: req.user,
        }
        mainNote.comments.push(comment)
        mainNote.save().then((updatetNote) => {
            res.status(httpStatus.OK)
                .json({ updatetNote })
                .catch((e) =>
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        error: 'Yorum Sırasında Bir Problem Oluştu',
                        code: e,
                    })
                )
        })
    })
}
const deleteComment =(req,res)=>{
    findOne({ _id: req.params.id }).then((mainNote) => {
        if (!mainNote)
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: 'Böyle bir not bulunmamaktadır' })
        mainNote.comments= mainNote.comments.filter(x => x._id != req.params.commentId)
        mainNote.save().then((updatetNote) => {
            res.status(httpStatus.OK)
                .json({ updatetNote })
                .catch((e) =>
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        error: 'Yorum Silme Sırasında Bir Problem Oluştu',
                        code: e,
                    })
                )
        })
    }) 
}

const listNote =(req,res)=>{
if(!req.params.id) return res.status(httpStatus.BAD_REQUEST).json({message:"ID bilgisi gerekli"});
findOne({_id:req.params.id}).then((note)=>{
    if(!note) return res.status(httpStatus.NOT_FOUND).json({message:"Böyle bir kayıt bulunamadı."});
     res.status(httpStatus.OK).json(note);
}).catch((e) =>
res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    error: 'ID bilgisi Hatalı',
})
)}
const updateComment =(req,res)=>{
    console.log(req.params);
    findOne({ _id: req.params.id }).then((mainNote) => {
        if (!mainNote)
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: 'Böyle bir not bulunmamaktadır' })
        mainNote.comments= mainNote.comments.filter(x => x._id != req.params.commentId)
        mainNote.findByIDAnd ().then((updatetNote) => {
            res.status(httpStatus.OK)
                .json({ updatetNote })
                .catch((e) =>
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        error: 'Yorum Güncelleme Sırasında Bir Problem Oluştu',
                        code: e,
                    })
                )
        })
    }) 
}
const update = (req, res) => {
    // console.log(req.body.password,cryptedPassword);
    if (!req.params.id) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: 'ID bilgisi hatalı' })
    } else {
        modify(req.body, req.params?.id)
            .then((updatetNote) => {
                if (!updatetNote) {
                    return res
                        .status(httpStatus.NOT_FOUND)
                        .json({ message: 'Böyle Bir Not Bulunamadı' })
                }
                res.status(httpStatus.OK).json(updatetNote)
            })
            .catch((e) =>
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Kayıt Sırasında Bir Problem Oluştu',
                    code: e,
                })
            )
    }
}

const index = (req, res) => {
    console.log(`object`, req.user)
    list()
        .then((response) => {
            res.status(httpStatus.CREATED).json(response)
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
        })
}

const deleteNote = (req, res) => {
    if (!req.params.id) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: 'ID bilgisi hatalı' })
    } else {
        removeNote(req.params?.id)
            .then((deleteNote) => {
                if (!deleteNote) {
                    return res
                        .status(httpStatus.NOT_FOUND)
                        .json({ message: 'Böyle bir kayıt bulunmamaktadır' })
                }
                res.status(httpStatus.OK).json({
                    message: 'Not Silinmiştir.',
                })
            })
            .catch((e) =>
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error: 'Silme İşlemi Sırasında Bir Problem Oluştu',
                })
            )
    }
}

module.exports = { create, index, update, deleteNote, makeComment ,deleteComment,updateComment,listNote}
