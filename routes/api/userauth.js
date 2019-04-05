const express = require('express');
const gravatar = require('gravatar');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User')

// @route GET /api/userauth/test
// @desc Tests Userauth route
// @access public
router.get('/test', function(req, res){
    res.json({msg : "User Works"})
});

// @route GET /api/userauth/register
// @desc Register User
// @access public
router.post('/register', function(req, res){

    const {errors, isValid} = validateRegisterInput(req.body);

    // Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email}).then(function(user){
        if(user){
            errors.email = 'Email already exists';
            return res.status(400).json(errors);
        }else{
            const avatar  = gravatar.url(req.body.email, {
                s:'200',
                r:'pg',
                d:'mm'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(err){
                        throw err;
                    }
                    newUser.password=hash;
                    newUser.save().then(function(user){
                        res.json(user);
                    }).catch(function(err){
                        console.log(err);
                    });
                });
            });
        }
    })
});


// @route GET /api/userauth/login
// @desc Login User / Returning JWT Token
// @access public
router.post('/login', function(req, res){
    
    const {errors, isValid} = validateLoginInput(req.body);

    // Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email}).then(function(user){
        if(!user){
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }

        // Check Password
        bcrypt.compare(password, user.password).then(function(isMatch){
            if(isMatch){
                //User Matched
                const payload = {id: user.id, name: user.name, avatar: user.avatar}; // Create JWT Payload
                
                // Sign Token
                jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, function(err, token){
                    res.json({sucess: true, token: 'Bearer '+token});
                });
            }else{
                errors.password = 'Password Incorrect'
                return res.status(400).json(errors);
            }
        });
    });
});


// @route GET /api/userauth/current
// @desc Return Current User
// @access private
router.get('/current', passport.authenticate('jwt', {session: false}), function(req, res){
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;