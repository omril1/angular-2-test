let mongoose = require('mongoose');
let Grid = require('gridfs-stream')
let connectionString = 'mongodb://localhost:27017/test';
let logger = console;

export = function () {
    mongoose.Promise = global.Promise;
    var options = { auto_reconnect: true };
    mongoose.connect(connectionString, options, function (err: Error) {
        if (err)
            logger.error(err.message, err);
        else
            logger.info("connected to mongodb sccessfuly.", { 'connection string': connectionString });
    });

    mongoose.connection.once("open", function () {
        Grid.mongo = mongoose.mongo;
        let gridFS = Grid(mongoose.connection.db);
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                logger.info('Process exiting now through app termination signal, closing mongoose connection');
                process.exit(0);
            })
        });
        mongoose.connection.on('disconnected', function () {
            //try to handle the state.
            //global.dbDisconnected = true;
            logger.error('disconnected from mongoDB');
        });
        mongoose.connection.on('reconnected', function () {
            //try to handle the state.
            //global.dbDisconnected = false;
            logger.error('reconnected to mongoDB');
        });
    });
}