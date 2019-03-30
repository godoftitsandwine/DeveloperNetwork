const express = require('express');
const router = express.Router();


// @route GET /api/userauth/test
// @desc Tests Userauth route
// @access public
router.get('/test', function(req, res){
    res.json({msg : "User Works"})
});

module.exports = router;