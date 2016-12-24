"use strict";
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var connectionString = 'mongodb://localhost:27017/test';
var logger = console;
module.exports = function () {
    mongoose.Promise = global.Promise;
    var options = { auto_reconnect: true };
    mongoose.connect(connectionString, options, function (err) {
        if (err)
            logger.error(err.message, err);
        else
            logger.info("connected to mongodb sccessfuly.", { 'connection string': connectionString });
    });
    mongoose.connection.once("open", function () {
        Grid.mongo = mongoose.mongo;
        var gridFS = Grid(mongoose.connection.db);
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                logger.info('Process exiting now through app termination signal, closing mongoose connection');
                process.exit(0);
            });
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
};
//# sourceMappingURL=connectMongoDB.js.map