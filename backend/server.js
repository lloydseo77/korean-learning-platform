// Server startup logic
// Environment config, database connection, and server entry point
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')

dotenv.config()

const PORT = process.env.PORT

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        // listen for requests
        app.listen(PORT, () => {
            console.log('Server running on port', PORT)
        })
    })
    .catch((error) => {
        console.log('DB connection error:', error)
        process.exit(1)
    })

