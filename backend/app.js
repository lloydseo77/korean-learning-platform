// Express configuration only
// Contains middleware and routes logic
const express = require('express')
const lessonRoutes = require('./routes/lessons')

const app = express()

// Middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Routes
app.use('/api/lessons', lessonRoutes)

module.exports = app