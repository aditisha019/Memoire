const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/google',passport.authenticate('google',{ scope: ['profile']}))

router.get('/google/callback',passport.authenticate('google',{ failureRedirect: '/'}),
(req,res)=>{
    res.redirect('/dashboard')
})

router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})
module.exports= router