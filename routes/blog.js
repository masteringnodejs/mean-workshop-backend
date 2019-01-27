// STEP 14: Add required imports and load 'blog' model from mongoose
// Also create empty handler functions for below:
// 1) listBlogs
// 2) addBlog
// 3) getBlog
// 4) addComment
// JUMP: STEP 15: Goto app.js and 
const mongoose = require('mongoose');
const blogmodel = mongoose.model('blog');

// STEP 16: Insert a blog into 'blog' model
module.exports.addBlog = function(req, res) {
    let blog = req.body.blog;
    blog.author = req.session.data.uname;
    blogmodel.create(blog, (err, blog) => {
        if(!err) {
            res.end(JSON.stringify(blog));
        }
        else {
            res.statusCode = 400;
            res.end(err);
        }
    });
}

// STEP 17: List all blogs
module.exports.listBlogs = function(req, res) {
    blogmodel.find({}, (err, data) => {
        if(!err){
            res.end(JSON.stringify(data));
        }
    });
}

// STEP 18: Get a particular blog based on its ID
module.exports.getBlog = function(req, res) {
    let id = req.params.id;
    blogmodel.findOne({_id: id}, (err, data) => {
        if(!err) {
            res.end(JSON.stringify(data));
        }
        else {
            res.statusCode = 404;
            res.end('Blog not found');
        }
    });
}


// STEP 19: Add comment to existing blog
module.exports.addComment = function(req, res) {
    if (req.body.comment && req.body.comment.comment && req.params.id) {

        let comment = req.body.comment;
        let id = req.params.id;
        console.log("Commented By: " + req.session.data.uname);
        comment.commentedBy = req.session.data.uname;
        // Get existing blog by id
        blogmodel.findOne({_id: id}, (err, data) => {
            if(!err) {
                // On finding blog, push new comment into 'comment' sub-document
                data.comments.push(comment);
                data.save((err, data) => {
                    if(!err) {
                        res.end(JSON.stringify(data));
                    }
                    else {
                        res.statusCode = 400;
                        res.end(err);
                    }
                });
            }
            else {
                res.statusCode = 404;
                res.end('Blog not found');
            }
        });
    }
    else {
        res.statusCode = 400;
        return res.end('Invalid comment');
    }
}