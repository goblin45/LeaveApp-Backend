require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

connectDB()

app.use(express.json())

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/students', require('./routes/studentsRoute'))
app.use('/admins', require('./routes/adminsRoute'))
app.use('/mails', require('./routes/mailsRoute'))
app.use('/schools', require('./routes/schoolsRoute'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB!")
    app.listen(PORT, () => {
        console.log(`Server listening to port ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})
