import express from 'express';
import userRouter from './routers/userRouter.js';
import { ErrorHandler, handleError } from './helpers/errorHandler.js'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'text/html' }));
app.use(express.raw({ type: 'text/xml' }));
app.use(express.json());

app.use('/users', userRouter);

app.use((err, req, res, next) => {
    handleError(err, res);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}...`);
});