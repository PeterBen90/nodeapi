const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/users');

//async await to query the DB for the user
//async await is used becasuse this process takes time
exports.register = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({
            error: 'Email is taken!'
        });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Signup successful! Please login.' });
};

exports.login = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        //if error or no user
        if (err || !user) {
            return res.status(401).json({
                error: 'User with that email does not exist, please register.'
            });
        }
        //if user is found make sure email and password match
        //create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'User does not exist, email and password do not match'
            });
        }
        //generate token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        //persist the token as the 'jwt-token' in cookie with expiry date
        res.cookie('jwt-token', token, { expire: new Date() + 9999 });

        //return response with user and token to frontend client
        const { _id, username, email } = user;
        return res.json({ token, user: { _id, email, username } });
    });
};

exports.logout = (req, res) => {
    res.clearCookie('jwt-token');

    return res.json({ message: 'User logged out succesfully' });
};

exports.requireLogin = expressJwt({
    //if token is valid, express jwt appends verified users id
    //in and auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});
