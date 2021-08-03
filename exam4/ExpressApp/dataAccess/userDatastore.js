import lowdb from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const moduleURL = path.dirname(fileURLToPath(import.meta.url));
const dbAsync = lowdb(new FileAsync(path.join(moduleURL, 'db.json')));

export default class Datastore {
    constructor() {
        this.tableName = 'users';
        this.dbContext = dbAsync.then(db => {
            db.defaults({ [this.tableName]: [] }).write();

            return db;
        });
    }

    getAllUsers = async () => {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .value();
    }

    getByNameOrEmail = async (propName, propValue) => {
        const dbContext = await this.dbContext;

        return dbContext
            .get(this.tableName)
            .find({ [propName]: propValue })
            .value() || [];
    }

    insertUser = async (user) => {
        const dbContext = await this.dbContext;
        const id = uuid();

        dbContext
            .get(this.tableName)
            .push({ id, ...user })
            .write();
    }

    updateUser = async (username, details) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .find({ 'username': username })
            .assign(details).write();
    }

    deleteUser = async (username) => {
        const dbContext = await this.dbContext;

        dbContext
            .get(this.tableName)
            .remove({ 'username': username }).write();
    }
}
