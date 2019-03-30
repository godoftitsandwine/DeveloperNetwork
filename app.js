const express = require('express');
const app = express();
const mongoose = require('mongoose');

const userauth = require('./routes/api/userauth.js');
const profile  = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

// DB Config
const db = require('./config/keys').mongoURL;
// Connect to MongoDB
mongoose.connect(db).then(function(){
    console.log('MongoDB Connected');
}).catch(function(err){
    console.log(err);
});

app.get("/", function(req, res){
    res.send("Hello World");
});

// Use Routes
app.use('/api/userauth', userauth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(3000, function(){
    console.log("Server Running on Port 3000");
});
