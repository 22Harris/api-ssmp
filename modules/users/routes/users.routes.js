const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controllers')

router.post('/login-users', usersController.loginUser);
router.post('/create-users', usersController.createUser);

module.exports = router;