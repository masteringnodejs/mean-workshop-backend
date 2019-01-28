// Step 0: Require all modules
// JUMP: STEP 0.1: In this same file
var db = require('./database-config/database');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var cors = require('cors');
var path = require('path');

app.use(bodyparser.json());
app.use(express.static('./public'));

var url = require('url');
const session = require('express-session');

// Initially during separate development
// app.use(cors({origin: [
//     "http://localhost:4200"
//   ], credentials: true}));


// Step 11: Setup express-session 
// JUMP: Step 12: Goback to user.js and store session
var sessionsettings = {
    secret: '1234', // The secret is required, and is used for signing cookies
    resave: false, // Force save of session for each request.
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: { httpOnly: false, maxAge: 5*60*1000 }
}

// Step 5.1: Setup DB and start server
db.connectAndPrepareDB(null, () => {
    app.use(session(sessionsettings));
    registerRoutes();
    app.listen(process.env.PORT || 8080 , (req, res) => {
        console.log("Blogger Server Started...");
    })
});

// Step 0.1: Register route handlers
// JUMP: to STEP 1: In database.js
function registerRoutes(){
    let userRoutes = require('./routes/user');
    let blogRoutes = require('./routes/blog');
    
    app.get('/', (req, res) => { 
        res.sendFile(path.join(__dirname,'/public/index.html'));
    });
    app.post('/register', userRoutes.register);
    app.post('/login', userRoutes.login);
    app.post('/logout', isAuthenticated, userRoutes.logout);

    // STEP 15: Add route handlers from blogRoutes
    // JUMP: STEP 16: Go back to blog.js to define code for these handlers
    app.get('/listblogs', isAuthenticated, blogRoutes.listBlogs) ;
    app.post('/addblog', isAuthenticated, blogRoutes.addBlog) ;
    app.get('/getblog/:id', isAuthenticated, blogRoutes.getBlog) ;
    app.post('/addcomment/:id', isAuthenticated, blogRoutes.addComment);
}


/**
 * TODO:
 * Further enhancements to be done by participants if they wish to learn more:
 * 1) A blogging system needs to have it's content open for reading but closed for editing or commenting.
 *    Currently our blogging system checks for session on all routes. Change this behaviour to let 
 *    blogs be read openly and ask for login only when one needs to add a blog or comment on blog
 * 2) Write tests using 'mocha': Write  tests for each API defined in this blogger.
 */
function isAuthenticated(req, res, next) {
    console.log("Auth Middleware: " + JSON.stringify(req.session));
    if (req.session.data) {
        return next();
    }

    res.statusCode = 401;
    res.end();
    return next(new Error('Unauthorized'));
  }

//  function enableCORS(app) {
//     app.use(function(req, res, next) {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");      
//         next();
//       });
//  }
