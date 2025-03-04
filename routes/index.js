const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// Login page
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', {
        layout: 'login',
    })
})

// Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {  // 🔹 Add `async` here
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('Dashboard', {
            name: req.user.firstName,  // 🔹 You forgot to pass `stories` in render
            stories: stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')  // 🔹 Send an error page instead of failing silently
    }
})

module.exports = router
