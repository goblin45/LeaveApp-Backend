const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

app.use('/', express.static(path.join(__dirname, '/public')))

app.all('*', )

app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`)
})