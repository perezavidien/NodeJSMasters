import { ErrorHandler } from './errorHandler.js'

export const isDataExisting = (data) => {
    return Object.keys(data).length > 0;
}

export const displayResponse = (res, data) => {
    if (!isDataExisting(data)) {
        throw new ErrorHandler(404, "Data not found.")
    }
    res.send(data);
}