const express = require('express');
const router = express.Router();


// @route GET /api/posts/test
// @desc Tests Posts route
// @access public
router.get('/test', function(req, res){
    res.json({msg : "Posts Works"})
});

module.exports = router;