const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const userauth = require('./routes/api/userauth.js');
const profile  = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

//Body-Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURL;
// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true}).then(function(){
    console.log('MongoDB Connected');
}).catch(function(err){
    console.log(err);
});

app.get("/", function(req, res){
    res.send("Hello World");
});

// Passport Middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/userauth', userauth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(3000, function(){
    console.log("Server Running on Port 3000");
});
