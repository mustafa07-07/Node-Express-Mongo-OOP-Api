const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors');
const loaders = require('./V2/src/loaders/')
const helmet = require('helmet')
const config = require('./V2/src/config')
const path = require('path');
const events = require('./V2/src/scripts/events/sendEmail')
config()
loaders()
events()
const port = process.env.APP_PORT || 3000
const { ProjectRoutes, NoteRoutes } = require('./V2/src/routes')
const app = express()
app.use(cors({origin: "*", credentials: true}));
app.use('./V2/src/uploads',express.static(path.join(__dirname,"/","uploads")))
app.use(express.json())
app.use(helmet())
app.use(fileUpload())

app.listen(port, () => {
    console.log(`Uygulama ${port} üzerinden çalışıyor..`)
    app.use('/users', ProjectRoutes)
    app.use('/notes', NoteRoutes)
})
