const express = require('express');
const { register, login, logout } = require('../controllers/auth');
const { userById } = require('../controllers/users');
const { createUserValidator } = require('../validators');

const router = express.Router();

router.post('/register', createUserValidator, register);
//login
router.post('/login', login);
//logout
router.get('/logout', logout);

//any route containing user id, app will first execute userById()
router.param('userId', userById);

module.exports = router;
