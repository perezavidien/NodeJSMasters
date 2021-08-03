import express from 'express';
import router from './routers/userRouter.js';
import { ErrorHandler, handleError } from './helpers/errorHandler.js'
import bodyParser from 'body-parser';

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'text/html' }));
app.use(express.raw({ type: 'text/xml' }));
app.use(express.json());

app.use('/users', router);

app.use((err, req, res, next) => {
    handleError(err, res);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}...`);
});