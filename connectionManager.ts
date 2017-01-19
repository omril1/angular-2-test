let mongoose = require('mongoose');
import * as Grid from 'gridfs-stream';
let connectionString = 'mongodb://localhost:27017/test';
let logger = console;

export let gfs: Grid.Grid;
export let connect = function (): Promise<any> {
    mongoose.Promise = global.Promise;
    var options = { auto_reconnect: true };
    return mongoose.connect(connectionString, options, function (err: Error) {
        if (err)
            logger.error(err.message, err);
        else
            logger.info("connected to mongodb sccessfuly.", { 'connection string': connectionString });
    }).then(function () {
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                logger.info('Process exiting now through app termination signal, closing mongoose connection');
                process.exit(0);
            })
        });
        mongoose.connection.on('disconnected', function () {
            logger.error('disconnected from mongoDB');
        });
        mongoose.connection.on('reconnected', function () {
            logger.error('reconnected to mongoDB');
        });
        return mongoose.connection;
    });
}