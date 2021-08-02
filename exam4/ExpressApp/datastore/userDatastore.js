const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync.js');
const path = require('path');
const { v4: uuid } = require('uuid');
const dbAsync = lowdb(new FileAsync(path.join(__dirname, 'db.json')));


class Datastore {
    constructor() {
        this.tableName = 'users';
        this.dbContext = dbAsync.then(db => {
            db.defaults({ [this.tableName]: [] }).write();

            return db;
        });
    }

    getAllUsers = async () => {
        const dbContext = await this.dbContext;
        return dbContext.get(this.tableName).value();
    }

    getByNameOrEmail = async (propName, propValue) => {
        const dbContext = await this.dbContext;
        return dbContext.get(this.tableName).find({ [propName]: propValue }).value() || [];
    }

    insertUser = async (user) => {
        const dbContext = await this.dbContext;
        const id = uuid();
        dbContext.get(this.tableName).push({ id, ...user }).write();
    }

    updateUser = async (username, details) => {
        const dbContext = await this.dbContext;
        dbContext.get(this.tableName).find({ 'username': username }).assign(details).write();
    }

    deleteUser = async (username) => {
        const dbContext = await this.dbContext;
        dbContext.get(this.tableName).remove({ 'username': username }).write();
    }
}