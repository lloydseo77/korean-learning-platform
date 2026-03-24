const express = require('express')
const { getUnits, getUnit } = require('../controllers/unitController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET all units
router.get('/', protect, getUnits)

// GET single unit with progress
router.get('/:id', protect, getUnit)

module.exports = router