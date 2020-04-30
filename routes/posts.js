const express = require('express');
const {
    getPosts,
    createPosts,
    postsByUser,
    postById,
    isPoster,
    deletePost
} = require('../controllers/posts');
const { requireLogin } = require('../controllers/auth');
const { userById } = require('../controllers/users');
const { createPostValidator } = require('../validators');

const router = express.Router();

router.get('/', getPosts);
router.post(
    '/post/new/:userId',
    requireLogin,
    createPosts,
    createPostValidator
);
router.get('/posts/by/:userId', requireLogin, postsByUser);
router.delete('/post/:postId', requireLogin, isPoster, deletePost);

//any route containing :userId, app will first execute userById()
router.param('userId', userById);

//any route containing :postId, app will first execute postById()
router.param('postId', postById);

module.exports = router;
