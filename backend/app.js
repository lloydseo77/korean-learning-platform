// Express configuration only
// Contains middleware and routes logic
const express = require('express')
const lessonRoutes = require('./routes/lessons')
const authRoutes = require('./routes/auth')
const unitRoutes = require('./routes/units')
const attemptRoutes = require('./routes/attempts')

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
app.use('/api/auth', authRoutes)
app.use('/api/units', unitRoutes)
app.use('/api/attempts', attemptRoutes)

module.exports = app