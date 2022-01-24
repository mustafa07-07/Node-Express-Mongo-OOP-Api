const {
    insert,
    list,
    loginUser,
    modify,
    removeUser,
} = require('../services/Users')
const noteService = require('../services/notes')
const httpStatus = require('http-status')
const uuid = require('uuid')
const eventEmiter = require('../scripts/events/eventEmiter')
const {
    generateAccessToken,
    generateRefreshToken,
    passwordToHash,
} = require('../scripts/utils/helper')
const path = require('path')
const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password)
    // console.log(req.body.password,cryptedPassword);
    insert(req.body)
        .then((response) => {
            res.status(httpStatus.CREATED).send(response)
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err)
        })
}

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password)
    loginUser(req.body)
        .then((user) => {
            if (!user) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .send({ message: 'User not found' })
            }
            user = {
                ...user.toObject(),
                tokens: {
                    access: generateAccessToken(user),
                    refresh: generateRefreshToken(user),
                },
            }
            delete user.password
            res.status(httpStatus.OK).send(user)
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err)
        })
}

const index = (req, res) => {
    console.log(`list`, req.user)
    list()
        .then((response) => {
            res.status(httpStatus.CREATED).send(response)
        })
        .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err)
        })
}
const deleteUser = (req, res) => {
    if (!req.params.id) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .send({ message: 'ID bilgisi hatalı' })
    } else {
        removeUser(req.params?.id)
            .then((deleteUser) => {
                if (!deleteUser) {
                    return res.status(httpStatus.NOT_FOUND).send({
                        message: 'Böyle bir kullanıcı bulunmamaktadır',
                    })
                }
                res.status(httpStatus.OK).send({
                    message: 'Kullanıcı Silinmiştir.',
                })
            })
            .catch((e) =>
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    error: 'Silme İşlemi Sırasında Bir Problem Oluştu',
                })
            )
    }
}

const updateProfileImage = (req, res) => {
    console.log(req.files)
    const extension = path.extname(req.files.profile_image.name)
    const fileName = `${req?.user._id}${extension}`
    const folderPath = path.join( __dirname,'../', 'uploads/users',fileName)
   
    if (!req?.files?.profile_image) {
        return res
            .send(httpStatus.BAD_REQUEST)
            .send({ error: 'İzin verilmeyen dosya ' })
    }
    req.files.profile_image.mv(folderPath, function (err) {
        if (err) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ error: err })
        }
    })
    console.log('resim yüklenmiştir.')
    modify({ _id: req.user._id }, { profile_image: fileName }).then(updatedUser=>{
        res.status(httpStatus.OK).send({message:updatedUser})
    }).catch(e=>res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:e}))
    //res.status(httpStatus.OK).send({message:"Profil resmi başarılı bir şekilde yüklendi.. "})
}
const changePassword = (req, res) => {
    req.body.password = passwordToHash(req.body.password)
    modify({ _id: req.user?._id }, req.body)
        .then((updatedUser) => {
            res.status(httpStatus.OK).send(updatedUser)
        })
        .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: e })
        })
}
const resetPassword = (req, res) => {
    const newPassword =
        uuid.v4()?.split('-')[0] || `usr-${new Date().getTime()}`
    modify({ email: req.body.email }, { password: passwordToHash(newPassword) })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .send({ message: 'Böyle Bir Kullanıcı Bulunamadı.' })
            }
            eventEmiter.emit('send_mail', {
                to: updatedUser.email,
                subject: 'Şifre Sıfırlama ✔',
                html: `Talebiniz üzerine şifreniz sıfırlanmıştır. <br/> Giriş Yaptıktan Sonra Şifrenizi Değiştirmeyi Unutmayınız. <br/> Yeni şifreniz<b> ${newPassword}</b>`,
            })
            res.status(httpStatus.OK).send({
                message:
                    'Şifre Sıfırlama İşlemi İçin Sisteme Kayıtlı Eposta Adresinize Gerekli Bilgileri Gönderdik.',
            })
        })
        .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                error: e.message,
            })
        })
}

const update = (req, res) => {
    modify({ _id: req.user?._id }, req.body)
        .then((updatedUser) => {
            res.status(httpStatus.OK).send(updatedUser)
        })
        .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: e })
        })
}

const noteList = (req, res) => {
    noteService
        .list({ user_id: req.user?._id })
        .then((notes) => {
            res.status(httpStatus.OK).send(notes)
        })
        .catch((e) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: e })
        })
}
module.exports = {
    create,
    index,
    login,
    noteList,
    resetPassword,
    update,
    deleteUser,
    changePassword,
    updateProfileImage,
}
