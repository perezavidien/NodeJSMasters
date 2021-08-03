import Datastore from '../dataAccess/userDatastore.js';
import Validator from 'validatorjs';
import { ErrorHandler } from '../helpers/errorHandler.js'
import { isUserExisting, displayResponse } from '../helpers/userValidators.js'

export const getAll = async (req, res, next) => {
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

export const getByUsername = async (req, res, next) => {
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


export const getByEmailAddress = async (req, res, next) => {
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

export const create = async (req, res, next) => {
    try {
        //console.log(req.body);
        const dataStore = new Datastore();
        const { username, emailAddress } = req.body;

        const detailsByEmail = await dataStore
            .getByNameOrEmail('emailAddress', emailAddress);
        const detailsByUsername = await dataStore
            .getByNameOrEmail('username', username);

        const validtionRules = {
            username: 'required|string',
            emailAddress: 'required|email',
            firstName: 'required|string',
            lastName: 'required|string'
        };

        const validation = new Validator(req.body, validtionRules);

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

export const updateByUsername = async (req, res, next) => {
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

export const deleteByUsername = async (req, res, next) => {
    try {
        const dataStore = new Datastore();
        const { username } = req.params;

        const user = await dataStore
            .getByNameOrEmail('username', username);

        if (!isUserExisting(user)) {
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