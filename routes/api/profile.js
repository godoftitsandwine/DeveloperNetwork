const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Profile
const User = require('../../models/User');

// @route GET /api/profile/test
// @desc Tests profiie route
// @access public
router.get('/test', function(req, res){
    res.json({msg : "Profile Works"})
});


// @route GET /api/profile
// @desc Gets Current User Profile
// @access private
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res){
    const errors = {};
    Profile.findOne({user: req.user.id}).then(function(profile){
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(function(err){
        res.status(404).json(err); 
    });
});


// @route POST /api/profile
// @desc Create User Profile
// @access private
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res){
    const errors = {};
    Profile.findOne({user: req.user.id}).then(function(profile){
        if(!profile){
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(function(err){
        res.status(404).json(err); 
    });
});

module.exports = router;