const express = require('express');
const { getPosts, createPosts } = require('../controllers/posts');
const { requireLogin } = require('../controllers/auth');
const { userById } = require('../controllers/users');
const { createPostValidator } = require('../validators');

const router = express.Router();

router.get('/', getPosts);
router.post('/post', requireLogin, createPostValidator, createPosts);

//any route containing user id, app will first execute userById()
router.param('userId', userById);

module.exports = router;
