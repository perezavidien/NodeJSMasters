import { ErrorHandler } from './errorHandler.js'

export const isUserExisting = (user) => {
    return Object.keys(user).length > 0;
}

export const displayResponse = (res, user) => {
    if (!isUserExisting(user)) {
        throw new ErrorHandler(404)
    }
    res.send(user);
}
