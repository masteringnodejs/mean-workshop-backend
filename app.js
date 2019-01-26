// Step 0: Require all modules
// JUMP: STEP 0.1: In this same file
var db = require('./database-config/database');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();
app.use(bodyparser.json());

// Step 11: Setup express-session 
// JUMP: Step 12: Goback to user.js and store session
let sessionSettings = {
    secret: 'sessionSecretPassword#$^#^',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 5*60*1000 } // 60 seconds * 5 = 5 minutes = 5*60*1000 ms
};
app.use(session(sessionSettings));

// Step 5.1: Setup DB and start server
db.connectAndPrepareDB(null, () => {
    registerRoutes();

    app.listen(3000, (req, res) => {
        console.log("Blogger Server Started...");
    })
    
});

// Step 0.1: Register route handlers
// JUMP: to STEP 1: In database.js
function registerRoutes(){
    let userRoutes = require('./routes/user');
    let blogRoutes = require('./routes/blog');

    enableCORS(app);
    app.get('/', (req, res) => { res.end('Hello, Welcome to Blogger!')});
    app.post('/register', userRoutes.register);
    app.post('/login', userRoutes.login);
    app.post('/logout', userRoutes.logout);

    // STEP 15: Add route handlers from blogRoutes
    // JUMP: STEP 16: Go back to blog.js to define code for these handlers
    app.get('/listblogs', blogRoutes.listBlogs) ;
    app.post('/addblog', blogRoutes.addBlog) ;
    app.get('/getblog/:id', blogRoutes.getBlog) ;
    app.post('/addcomment/:id', blogRoutes.addComment);
}


/**
 * TODO:
 * Further enhancements to be done by participants if they wish to learn more:
 * 1) A blogging system needs to have it's content open for reading but closed for editing or commenting.
 *    Currently our blogging system checks for session on all routes. Change this behaviour to let 
 *    blogs be read openly and ask for login only when one needs to add a blog or comment on blog
 * 2) Write tests using 'mocha': Write  tests for each API defined in this blogger.
 */


 function enableCORS(app) {
    app.use(function(req, res, next) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");      
        next();
      });
 }