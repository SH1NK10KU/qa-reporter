/**
 * @author Shin Feng
 *
 * MySQL连接池
 */
var config = require('./config');
MySqlPool = {
    createPool: function(dbname) {
        var mysql = require('mysql');
        var pool = mysql.createPool({
            connectionLimit: config[dbname].connectionLimit,
            host: config[dbname].host,
            port: config[dbname].port,
            user: config[dbname].user,
            password: config[dbname].password,
            database: config[dbname].database,
            debug: false,
            dateStrings: true
        });
        return pool;
    },
    query: function(dbname, sql, values, callback) {
        var pool = this.createPool(dbname);
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log(new Date() + " Reconnect.");
                setTimeout(MySqlPool.query(dbname, sql, values, callback), 2000);
                return;
            }
            console.log(dbname + ' connected as id ' + connection.threadId);
            var query = connection.query(sql, values, function() {
                callback.apply(connection, arguments);
                connection.release();
            });
            // console.log(query.sql);
            connection.on('error', function(err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    MySqlPool.query(dbname, sql, values, callback);
                } else {
                    console.log(err);
                    throw err;
                }
            });
        });
    }
};
module.exports = MySqlPool;