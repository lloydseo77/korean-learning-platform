// Express configuration only
// Contains middleware and routes logic
const express = require('express')
const cors = require('cors')
const lessonRoutes = require('./routes/lessons')
const authRoutes = require('./routes/auth')
const unitRoutes = require('./routes/units')
const attemptRoutes = require('./routes/attempts')
const progressRoutes = require('./routes/progress')

const app = express()

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // Local development
        'http://localhost:5173', // Vite dev server
        /vercel\.app$/ // Any Vercel deployment
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

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
app.use('/api/progress', progressRoutes)

module.exports = app