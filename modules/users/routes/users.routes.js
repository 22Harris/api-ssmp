const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controllers')

router.post('/login', usersController.loginUser);
router.post('/register', usersController.createUser);

module.exports = router;