const User = require('../models/users');
const _ = require('lodash');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        //adds profile object in request with user info
        req.profile = user;
        next();
    });
};

exports.userAuthorized = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};

exports.getAllUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: 'err'
            });
        }
        res.json({ users });
    }).select('username email updated created');
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    //lodash method extend takes 2 args 'user object' and 'request body'
    //extends user object with updated info from req.body which mutates source object
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save(err => {
        if (err) {
            return res.status(400).json({
                error: 'You are not authorized to perform this action'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({ user });
    });
};

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: 'User has been deleted successfully!' });
    });
};
