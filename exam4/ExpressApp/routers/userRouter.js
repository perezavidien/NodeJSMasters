import express from 'express'
import * as userController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', userController.getAll);

userRouter.get('/user/:username', userController.getByUsername);

userRouter.get('/user/email/:emailAddress', userController.getByEmailAddress);

userRouter.post('/', userController.create);

userRouter.put('/user/:username', userController.updateByUsername);

userRouter.delete('/user/:username', userController.deleteByUsername);

export default userRouter;