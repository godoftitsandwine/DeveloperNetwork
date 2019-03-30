const express = require('express');
const gravatar = require('gravatar');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

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
    User.findOne({email: req.body.email}).then(function(user){
        if(user){
            return res.status(400).json({email: "Email already exists"});
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
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email}).then(function(user){
        if(!user){
            return res.status(404).json({email: 'User not found'});
        }

        // Check Password
        bcrypt.compare(password, user.password).then(function(isMatch){
            if(isMatch){
                //User Matched
                const payload = {id: user.id, name: user.name, avatar: user.avatar}; // Create JWT Payload
                
                // Sign Token
                jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, function(err, token){
                    res.json({sucess: true, token: 'Bearer'+token});
                });
            }else{
                return res.status(400).json({password: 'Password Incorrect'});
            }
        });
    });
});

module.exports = router;