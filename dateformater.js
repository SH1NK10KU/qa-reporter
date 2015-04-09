/**
 * @author Shin Feng
 *
 * 时间格式化
 */
var DateFormater = {
    getToday: function() {
        var date = new Date();
        date.setDate(21);
        return date.format("yyyy-MM-dd");
    },
    getLastMonthDate: function() {
        var date = new Date();
        if (date.getMonth() == 0) {
            date.setYear(date.getYear - 1);
        }
        date.setDate(21);
        date.setMonth(date.getMonth() - 1);
        return date.format("yyyy-MM-dd");
    }
};
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
module.exports = DateFormater;