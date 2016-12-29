"use strict";
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var connectionString = 'mongodb://localhost:27017/test';
var logger = console;
function default_1() {
    if (mongoose.connection && mongoose.connection.host)
        return new Promise(function (resolve, reject) { resolve(mongoose.connection); });
    else {
        mongoose.Promise = global.Promise;
        var options = { auto_reconnect: true };
        return mongoose.connect(connectionString, options, function (err) {
            if (err)
                logger.error(err.message, err);
            else
                logger.info("connected to mongodb sccessfuly.", { 'connection string': connectionString });
        }).then(function () {
            Grid.mongo = mongoose.mongo;
            var gridFS = Grid(mongoose.connection.db);
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
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=connectMongoDB.js.map