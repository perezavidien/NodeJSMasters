const express = require('express');
const userController = require('../controllers/userController.js');


const router = express.Router();

router.get('/', userController.getAllUsers);

router.get('/user/:username', userController.getUserByUsername);

router.get('/user/email/:emailAddress', userController.getUserByEmailAddress);

router.post('/', userController.createUser);

router.put('/user/:username', userController.updateUser);

router.delete('/user/:username', userController.deleteUser);

module.exports = router;