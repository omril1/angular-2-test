"use strict";
var mongoose = require('mongoose');
var Grid = require("gridfs-stream");
var connectionString = 'mongodb://localhost:27017/test';
var logger = console;
exports.connect = function () {
    mongoose.Promise = global.Promise;
    var options = { auto_reconnect: true };
    return mongoose.connect(connectionString, options, function (err) {
        if (err)
            logger.error(err.message, err);
        else
            logger.info("connected to mongodb sccessfuly.", { 'connection string': connectionString });
    }).then(function () {
        exports.gfs = Grid(mongoose.connection.db, mongoose.mongo);
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                logger.info('Process exiting now through app termination signal, closing mongoose connection');
                process.exit(0);
            });
        });
        mongoose.connection.on('disconnected', function () {
            logger.error('disconnected from mongoDB');
        });
        mongoose.connection.on('reconnected', function () {
            logger.error('reconnected to mongoDB');
        });
        return mongoose.connection;
    });
};
//# sourceMappingURL=connectionManager.js.map