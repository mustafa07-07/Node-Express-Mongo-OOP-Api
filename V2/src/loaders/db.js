const Mongoose = require('mongoose')
const db = Mongoose.connection
try {
    db.once('open', () => {
        console.log('DB Bağlantısı Başarılıdır.')
    })
} catch (error) {
    console.err('DB Bağlantısı Sırasında Hata')
}

const connectDB = async () => {
    await Mongoose.connect(
    //    `mongodb://${process.env.DB_HOST_PRO}:${process.env.DB_PORT_PRO}/${process.env.DB_NAME_PRO}`,
        `mongodb+srv://mustafa9507:Mustafa07.@cluster0.spl1o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
}
module.exports = {
    connectDB,
}
