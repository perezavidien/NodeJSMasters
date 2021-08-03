import Datastore from '../dataAccess/userDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { isUserExisting, displayResponse } from '../helpers/userValidators.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const dataStore = new Datastore()
        const users = await dataStore.getAllUsers();

        res.send(users);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const getUserByUsername = async (req, res, next) => {
    try {
        const dataStore = new Datastore()
        const { username } = req.params;

        const user = await dataStore.getByNameOrEmail('username', username);

        displayResponse(res, user);

        next()
    }
    catch (err) {
        next(err)
    }
}


export const getUserByEmailAddress = async (req, res, next) => {
    try {
        const dataStore = new Datastore();
        const { emailAddress } = req.params;
        //console.log(req.params);

        const user = await dataStore.getByNameOrEmail('emailAddress', emailAddress);

        displayResponse(res, user);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const createUser = async (req, res, next) => {
    try {
        //console.log(req.body);

        const dataStore = new Datastore();
        const { username, emailAddress } = req.body;

        // console.log(username);
        // console.log(emailAddress);

        const detailsByEmail = await dataStore
            .getByNameOrEmail('emailAddress', emailAddress);
        const detailsByUsername = await dataStore
            .getByNameOrEmail('username', username);

        const rules = {
            username: 'required|string',
            emailAddress: 'required|email',
            firstName: 'required|string',
            lastName: 'required|string'
        };

        const validation = new Validator(req.body, rules);

        if (isUserExisting(detailsByEmail) || isUserExisting(detailsByUsername)) {
            throw new ErrorHandler(409);
        }
        else if (validation.fails()) {
            throw new ErrorHandler(400);
        }

        await dataStore
            .insertUser(req.body);

        res.sendStatus(201);

        next()
    }
    catch (err) {
        next(err)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const dataStore = new Datastore();
        const { username } = req.params;

        const rules = {
            emailAddress: 'email',
            firstName: 'string',
            lastName: 'string'
        };

        const validation = new Validator(req.body, rules);
        const detailsByEmail = await dataStore
            .getByNameOrEmail('emailAddress', req.body.emailAddress);
        const detailsByUsername = await dataStore
            .getByNameOrEmail('username', username);

        if (!isUserExisting(detailsByUsername)) {
            throw new ErrorHandler(404);
        }
        else if (req.body.username !== undefined || validation.fails()) {
            throw new ErrorHandler(400);
        }
        else if (isUserExisting(detailsByEmail)) {
            throw new ErrorHandler(409);
        }

        await dataStore
            .updateUser(username, req.body);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }

}

export const deleteUser = async (req, res, next) => {
    try {
        const dataStore = new Datastore();
        const { username } = req.params;

        const detailsByUsername = await dataStore
            .getByNameOrEmail('username', username);

        if (!isUserExisting(detailsByUsername)) {
            throw new ErrorHandler(404);
        }

        await dataStore
            .deleteUser(username);

        res.sendStatus(200);

        next()
    }
    catch (err) {
        next(err)
    }
}