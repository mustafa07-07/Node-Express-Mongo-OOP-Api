const Mongoose = require('mongoose')
const db = Mongoose.connection
try {
    db.once('open', () => {
        console.log('DB Bağlantısı Başarılıdır')
    })
} catch (error) {
    console.err('DB Bağlantısı Sırasında Hata')
}

const connectDB = async () => {
    await Mongoose.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
}
module.exports = {
    connectDB,
}
