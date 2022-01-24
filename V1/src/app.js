const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors');
const loaders = require('./loaders')
const helmet = require('helmet')
const config = require('./config')
const path = require('path')
const events = require('./scripts/events/sendEmail')
config()
loaders()
events()
const port = process.env.APP_PORT || 3000
const { ProjectRoutes, NoteRoutes } = require('./routes')
const app = express()
app.use(cors({origin: "*", credentials: true}));
app.use('/uploads',express.static(path.join(__dirname,"/","uploads")))
app.use(express.json())
app.use(helmet())
app.use(fileUpload())

app.listen(port, () => {
    console.log(`Uygulama ${port} üzerinden çalışıyor..`)
    app.use('/users', ProjectRoutes)
    app.use('/notes', NoteRoutes)
})
