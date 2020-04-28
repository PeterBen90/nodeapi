const express = require('express');
const {
    userById,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/users');
const { requireLogin } = require('../controllers/auth');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/user/:userId', requireLogin, getUser);
router.put('/user/:userId', requireLogin, updateUser);
router.delete('/user/:userId', requireLogin, deleteUser);

//any route containing user id, app will first execute userById()
router.param('userId', userById);

module.exports = router;
