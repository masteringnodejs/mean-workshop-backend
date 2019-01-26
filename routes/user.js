const mongoose = require('mongoose');
const usermodel = mongoose.model('user');
const crypto = require('crypto');
const PBKDF_HASH_ROUNDS = 10;
const PBKDF_KEY_LEN = 32;
const PBKDF_SALT_LEN = 16;

// Step 6: Implement registering a new user
module.exports.register = (req, res) => {
    console.log("Body:", req.body);
    if (!req.body.uname || !req.body.password) { return res.end(new Error('Invalid POST data')) };
    
    var instance = new usermodel();
    instance.uname = req.body.uname;
    instance.password = req.body.password;

    // Step 8: Overwrite with hashed password
    instance.password = hashPassword(req.body.password)
    console.log("Hashed Password:", instance.password);

    instance.save((err) => {
        if (err) console.log(err);
        res.statusCode = 500;
        return res.end('Username already taken!');
    });
    res.statusCode = 200;
    res.end();
};


// Step 7: Implement password hashing
function hashPassword(password) {

    const salt = crypto.randomBytes(PBKDF_SALT_LEN);
    let hashedPassword = crypto.pbkdf2Sync(password, salt, PBKDF_HASH_ROUNDS, PBKDF_KEY_LEN, 'SHA256' ); 
    hashedPassword = hashedPassword.toString('hex');
 
    // Above we had tried without hashing password, now we are improving the 
    // implementation by hashing password
    // 7.1: We need to store salt and num rounds along with password string so that we can store them
    let finalPassword = salt.toString('hex') + ":" + hashedPassword;
    // 7.2: We need to overwrite plain password with hashed password
    return finalPassword;
}

// Step 9: Compare password routine
function comparePassword(candidatePassword, username, cb){
    usermodel.findOne({"uname": username}, (err, data) => {
        if(!err && data) {
            let pwdArray = data.password.split(":");
            let salt = pwdArray[0];
            let hashedPassword = pwdArray[1];
            console.log("From db,   hashed pwd: ", hashedPassword);

            let hashedCandidatePassword = crypto.pbkdf2Sync(candidatePassword, Buffer.from(salt, 'hex'), PBKDF_HASH_ROUNDS, PBKDF_KEY_LEN, 'SHA256' ); 
            console.log("candidate, hashed pwd: ", hashedCandidatePassword.toString('hex'));
            
            if (hashedPassword === hashedCandidatePassword.toString('hex')) {
                return cb(true);
            }
            return cb(false);
        }
        else {
            return cb(false);
        }
        
    });
}

// Step 10: use compare password routine to implement login route
// JUMP: Step 11 in app.js, add express session details to store session on login
module.exports.login = (req, res) => {
    let uname = req.body.uname;
    let candidatePassword = req.body.password;
    console.log("Session:", req.session);
    console.log(candidatePassword + ":" + uname);
    comparePassword(candidatePassword, uname, (result) => {
        if(result){
            res.statusCode = 200;
            console.log("Auth Successful");
            // Step 12: Add data to session to be stored in session storage on the 
            // server side. Only session id will be sent to be stored in cookie on browser.
            req.session.uname = uname;
            req.session.loggedin = true;
            res.end(JSON.stringify({resp: 'Auth Successful'}));

        }
        else {
            console.log("Auth Unsuccessful");
            res.statusCode = 400;
            res.end();
        }
    });
};

// STEP 13: Perform logout by destroying session
// JUMP: STEP 14: Goto blog.js to define route handlers for blog handling
module.exports.logout = (req, res) => {
    // Check if incoming request is from a logged in user,
    // then destroy session
    if (req.session.uname) {
        let uname = req.session.uname;
        req.session.destroy((err) => {
            console.log("Destroyed Session and Logged Out");
            return res.end(JSON.stringify({uname: uname}));
        });
    } else {
        res.statusCode = 401;
        res.end('Already logged out');
    }
};
