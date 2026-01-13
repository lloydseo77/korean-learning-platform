// Express configuration only
// Contains middleware and routes logic
const express = require('express')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

module.exports = app