const UserService = require('../services/UserService')

const NoteService = require('../services/NoteService')
const httpStatus = require('http-status')
const uuid = require('uuid')
const eventEmiter = require('../scripts/events/eventEmiter')
const {
    generateAccessToken,
    generateRefreshToken,
    passwordToHash,
} = require('../scripts/utils/helper')
const path = require('path')
class Users {
    create(req, res) {
        req.body.password = passwordToHash(req.body.password)
        // console.log(req.body.password,cryptedPassword);
        UserService.create(req.body)
            .then((response) => {
                res.status(httpStatus.CREATED).json(response)
            })
            .catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
            })
    }
    login(req, res) {
        req.body.password = passwordToHash(req.body.password)
        UserService.loginUser(req.body)
            .then((user) => {
                if (!user) {
                    return res
                        .status(httpStatus.NOT_FOUND)
                        .json({ message: 'User not found' })
                }
                user = {
                    ...user.toObject(),
                    tokens: {
                        access: generateAccessToken(user),
                        refresh: generateRefreshToken(user),
                    },
                }
                delete user.password
                res.status(httpStatus.OK).json(user)
            })
            .catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
            })
    }
    noteList(req, res) {
        NoteService.list({ user_id: req.user?._id })
            .then((notes) => {
                res.status(httpStatus.OK).json(notes)
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: e })
            })
    }
    index(req, res) {
        console.log(`list`, req.user)
        UserService.list()
            .then((response) => {
                res.status(httpStatus.CREATED).json(response)
            })
            .catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err)
            })
    }
    deleteUser(req, res) {
        if (!req.params.id) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: 'ID bilgisi hatalı' })
        } else {
            UserService.delete(req.params?.id)
                .then((deleteUser) => {
                    if (!deleteUser) {
                        return res.status(httpStatus.NOT_FOUND).json({
                            message: 'Böyle bir kullanıcı bulunmamaktadır',
                        })
                    }
                    res.status(httpStatus.OK).json({
                        message: 'Kullanıcı Silinmiştir.',
                    })
                })
                .catch((e) =>
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        error: 'Silme İşlemi Sırasında Bir Problem Oluştu',
                    })
                )
        }
    }

    updateProfileImage(req, res) {
        console.log(req.files)
        const extension = path.extname(req.files.profile_image.name)
        const fileName = `${req?.user._id}${extension}`
        const folderPath = path.join(
            __dirname,
            '../',
            'uploads/users',
            fileName
        )

        if (!req?.files?.profile_image) {
            return res
                .json(httpStatus.BAD_REQUEST)
                .json({ error: 'İzin verilmeyen dosya ' })
        }
        req.files.profile_image.mv(folderPath, function (err) {
            if (err) {
                return res
                    .status(httpStatus.INTERNAL_SERVER_ERROR)
                    .json({ error: err })
            }
        })
        console.log('resim yüklenmiştir.')
        UserService.update({ _id: req.user._id }, { profile_image: fileName })
            .then((updatedUser) => {
                res.status(httpStatus.OK).json({ message: updatedUser })
            })
            .catch((e) =>
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: e })
            )
        //res.status(httpStatus.OK).json({message:"Profil resmi başarılı bir şekilde yüklendi.. "})
    }
    changePassword(req, res) {
        req.body.password = passwordToHash(req.body.password)
        UserService.update({ _id: req.user?._id }, req.body)
            .then((updatedUser) => {
                res.status(httpStatus.OK).json(updatedUser)
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: e,
                })
            })
    }
    resetPassword(req, res) {
        const newPassword =
            uuid.v4()?.split('-')[0] || `usr-${new Date().getTime()}`
        UserService.updateWhere(
            { email: req.body.email },
            { password: passwordToHash(newPassword) }
        )
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res
                        .status(httpStatus.NOT_FOUND)
                        .json({ message: 'Böyle Bir Kullanıcı Bulunamadı.' })
                }
                eventEmiter.emit('send_mail', {
                    to: updatedUser.email,
                    subject: 'Şifre Sıfırlama ✔️',
                    html: `Talebiniz üzerine şifreniz sıfırlanmıştır. <br/> Giriş Yaptıktan Sonra Şifrenizi Değiştirmeyi Unutmayınız. <br/> Yeni şifreniz<b> ${newPassword}</b>`,
                })
                res.status(httpStatus.OK).json({
                    message:
                        'Şifre Sıfırlama İşlemi İçin Sisteme Kayıtlı Eposta Adresinize Gerekli Bilgileri Gönderdik.',
                })
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error: e.message,
                })
            })
    }

    update(req, res) {
        UserService.update({ _id: req.user?._id }, req.body)
            .then((updatedUser) => {
                res.status(httpStatus.OK).json(updatedUser)
            })
            .catch((e) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: e,
                })
            })
    }
}
module.exports = new Users()
