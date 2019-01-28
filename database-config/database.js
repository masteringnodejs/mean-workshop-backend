var mongoose = require('mongoose');

// Step 1: Fill in below function to create a new schema object
function createUserSchema(){
    let userSchema = new mongoose.Schema({
        uname : {type: String, unique: true, index: true},
        password : String
    });

    return userSchema;
}

// Step 2: Fill in below function to create a model from given schema
/**
 * 
 * @param {String} name String specifying mongoose name for model
 * @param {mongoose.Schema} schema
 */
function createModel(name, schema) {
    // 1. Check if inputs are valid, else return with error
    if (!schema || !name) return new Error('Schema object or Schema name invalid');

    // 2. Create model object and return
    return mongoose.model(name, schema);
    
}


// Step 3: Create a mongodb connection function
// Connection string of the form: mongodb://<hostname>:<port>/<dbname>

function connectAndPrepareDB(mongourl, cb) {

    //let connUrl = 'mongodb://localhost:27017/bloggerdb';
    let connUrl = 'mongodb://gpwsmean:gpwsmean1@ds213715.mlab.com:13715/gpblogger
    if(mongourl) connUrl = mongourl;

    console.log("Mongoose Connection Initiated...");

    mongoose.connect(connUrl, 
        {useNewUrlParser: true})
        .then(() => {
            console.log("Mongoose Connection Succeeded...");
            console.log("Created User Collection...");
            usermodel = createModel('user', createUserSchema());
            // Step 5: invoke create model for blog schema
            // JUMP: Step 5.1: Invoke connectAndPrepareDB() in app.js
            // JUMP: Step 6: TODO: Implement in user.js
            blogmodel = createModel('blog', createBlogSchema());
            return cb(null);
        })
        .catch((err) => {
            console.log("Error: ", err);
            return cb(err);
        });

}


// Step 4: Fill in below function to create a new blog schema
function createBlogSchema(){
    let blogSchema = new mongoose.Schema({
        title : String,
        imageLink : String,
        blogContent: String,
        summary: String,
        author: String,
        createdAt: { type: Date, default: Date.now() },
        comments: [{
            comment: String,
            createdAt: { type: Date, default: Date.now() },
            commentedBy: String
        }]
    });

    return blogSchema;
}

module.exports = {
    connectAndPrepareDB: connectAndPrepareDB
}
