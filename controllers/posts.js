const Post = require('../models/posts');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id username')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};

exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate('postedBy', '_id username')
        .select('_id title body')
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => console.log(err));
};

exports.createPosts = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                errer: 'Image could not be uploaded'
            });
        }
        //new post associated with user
        //handle files with file system, saves path and content type
        let post = new Post(fields);

        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        //save the post
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

//find posts based on postedBy
exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id username')
        .sort('_created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};

exports.isPoster = (req, res, next) => {
    let isPoster =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;

    console.log('req.post ', req.post);
    console.log('req.auth', req.auth);
    console.log('req.post.postedBy._id', req.post.postedBy._id);
    console.log('req.auth._id', req.auth._id);

    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
};

exports.updatePost = (req, res, next) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updated = Date.now();
    post.save(err => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(post);
    });
};

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Post deleted successfully'
        });
    });
};
