const express = require('express');
const router = express.Router();


// @route GET /api/profiel/test
// @desc Tests profiie route
// @access public
router.get('/test', function(req, res){
    res.json({msg : "Profile Works"})
});

module.exports = router;