const express = require('express');
const gravatar = require('gravatar');
const router = express.Router();
const bcrypt = require('bcryptjs');

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

module.exports = router;