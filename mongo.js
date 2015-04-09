/**
 * @author Shin Feng
 *
 * MongoDB管理器
 */
var config = require('./config');
MongoManager = {
    connect: function(dbname) {
        var mongodb = require('mongodb');
        var server = new mongodb.Server(config[dbname].host, config[dbname].port, {
            auto_reconnect: true
        });
        var db = new mongodb.Db(config[dbname].database, server, {
            safe: true
        });
        return db;
    },
    find: function(dbname, collection, condition, inventory, callback) {
        var db = this.connect(dbname);
        db.open(function(err, db) {
            if (err) {
                throw err;
            }
            db.createCollection(collection, {
                safe: true
            }, function(err, collection) {
                if (err) {
                    throw err;
                }
                collection.find(condition, inventory).toArray(function(err, docs) {
                    callback(docs);
                    db.close();
                });
            });
        });
    },
    insert: function(dbname, collection, data, callback) {
        var db = this.connect(dbname);
        db.open(function(err, db) {
            if (err) {
                throw err;
            }
            db.createCollection(collection, {
                safe: true
            }, function(err, collection) {
                if (err) {
                    throw err;
                }
                collection.insert(data, {
                    safe: true
                }, function(err, result) {
                    console.log(result);
                    db.close();
                });
            });
        });
    }
};
module.exports = MongoManager;