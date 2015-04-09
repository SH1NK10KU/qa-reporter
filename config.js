/**
 * @author Shin Feng
 *
 * 配置加载
 */
var config = require('./config.json'),
    env = process.env.NODE_ENV || 'development';
var envConfig = config.environment[env],
    param;
for (param in envConfig) {
    config[param] = envConfig[param];
}
module.exports = config;