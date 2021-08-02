
const router = require('./routers/userRouter.js');
const { handleError } = require('./helpers/errorHandler.js');
const express = require('express');
const app = express();

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