const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// register a new user
const registerUser = async (req, res) => {
    const { email, password, name } = req.body

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ error: 'Email already in use' })
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = await User.create({ email, password, name })

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ user: user.toJSON(), token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Compare passwords using the method on userModel
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.json({ user: user.toJSON(), token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    registerUser,
    loginUser
}
