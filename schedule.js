/**
 * @author Shin Feng
 *
 * 计划任务
 */
var later = require('later');
var config = require('./config');
var service = require('./service');
var Schedule = {
    sync: function() {
        var text = later.parse.text(config['schedule'].text);
        // var cron = later.parse.cron(config['schedule'].cron);
        // var composite = [{
        //     D: [21],
        //     h: [0],
        //     m: [0]
        // }];
        // var sched = {
        //     schedules: composite
        // };
        later.date.localTime();
        console.log(later.schedule(text).next(1));
        later.setInterval(function() {
            service.syncStatisticalResultFromJira();
        }, text);
    }
};
Schedule.sync();
module.exports = Schedule;