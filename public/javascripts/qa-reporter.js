/**
 * @author Shin Feng
 *
 * 前端页面
 */
var url = "http://" + window.location.host + "/results";
$(document).ready(function() {
    createRadioPanel("realtime")
    createSearchPanel("realtime");
    createSummary();
    var end = DateFormater.getToday();
    var start = DateFormater.getLastMonthDate();
    $("#start").val(start);
    $("#end").val(end);
    var pname = $("#pname").val();
    $("input[name='search-mode']").on("click", function() {
        var mode = $("input[name='search-mode']:checked").val();
        createSearchPanel(mode);
        createSummary();
    });
});
var createRadio = function(selector, name, id, text) {
    var template = "<input name='{0}' type='radio' id='{1}' value='{1}'><label for='{0}'>{2}</label>";
    $(selector).append(template.format(name, id, text));
};
var createLabel = function(selector, id, text) {
    var template = "<div><label for='{0}'>{1}</label><div id='{0}'></div></div>";
    $(selector).append(template.format(id, text));
};
var createTable = function(selector, id, text) {
    var template = "<div><label for='{0}'>{1}</label><table id='{0}'></table></div>";
    $(selector).append(template.format(id, text));
};
var createDate = function(selector, id, text) {
    var template = "<label for='{0}'>{1}</label><input id='{0}' type='date'>";
    $(selector).append(template.format(id, text));
};
var createSelect = function(selector, id, text) {
    var template = "<label for='{0}'>{1}</label><select name='{0}' id='{0}'></select>";
    $(selector).append(template.format(id, text));
}
var createOptions = function(selector, options) {
    var html = "";
    var template = "<option value='{0}'>{0}</option>";
    for (var index = 0; index < options.length; index++) {
        html += template.format(options[index]);
    }
    $(selector).html(html);
}
var createSubmit = function(selector, id, text) {
    var template = "<input id='{0}' type='submit' value='{1}'>";
    $(selector).append(template.format(id, text));
}
var createRadioPanel = function(mode) {
    $("#radio_panel").empty();
    createRadio("#radio_panel", "search-mode", "realtime", "实时查询");
    createRadio("#radio_panel", "search-mode", "history", "历史查询");
    if (mode === "realtime") {
        $("#realtime").attr("checked", true);
    } else if (mode === "history") {
        $("#history").attr("checked", true);
    }
}
var createSearchPanel = function(mode) {
    $("#search_form").empty();
    $("#error").empty();
    if (mode === "realtime") {
        createDate("#search_form", "start", "开始日期");
        createDate("#search_form", "end", "结束日期");
        createSelect("#search_form", "pname", "项目名称");
        createOptions('#pname', ["小型项目管理系统", "在线问题跟踪系统"]);
        createSubmit("#search_form", "search", "查　询");
        var end = DateFormater.getToday();
        var start = DateFormater.getLastMonthDate();
        var pname = $("#pname").val();
        $("#start").val(start);
        $("#end").val(end);
        $("#start").on("valuechange", function(e) {
            var date = $(this).val();
            if (date > end) {
                $("#start").val(start);
                $("#error").html("输入开始时间需要小于结束时间");
            } else {
                start = $(this).val();
                $("#error").empty();
            }
        });
        $("#end").on("valuechange", function(e) {
            var date = $(this).val();
            if (date < start) {
                $("#end").val(end);
                $("#error").html("输入开始时间需要小于结束时间");
            } else {
                end = $(this).val();
                $("#error").empty();
            }
        });
        $("#pname").on("valuechange", function(e) {
            pname = $("#pname").val();
            createSummary();
        });
        $("#search").on("click", function() {
            updateSummary(start, end, pname);
            return false;
        });
    } else if (mode === "history") {
        createSelect("#search_form", "pname", "项目名称");
        createOptions('#pname', ["小型项目管理系统", "在线问题跟踪系统"]);
        createSelect("#search_form", "end", "历史时间");
        createHistoryDateOptions("#end", "小型项目管理系统")
        createSubmit("#search_form", "history-search", "查　询");
        $("#pname").on("valuechange", function(e) {
            var pname = $("#pname").val();
            createHistoryDateOptions("#end", pname);
            createSummary();
        });
        $("#history-search").on("click", function() {
            var end = $("#end").val();
            var pname = $("#pname").val();
            getHistory(end, pname);
            return false;
        });
    }
}
var QueryRequest = (function() {
    function QueryRequest(type, start, end, pname, gname) {
        this.type = type;
        var values = new Object();
        values.start = start;
        values.end = end;
        values.pname = pname;
        values.gname = gname;
        this.values = JSON.stringify(values);
    }
    return QueryRequest;
})();
var createHistoryDateOptions = function(selector, pname) {
    var request = new QueryRequest("getHistoryDate", null, null, pname, null);
    var options = {
        "url": url,
        "type": "post",
        "dataType": "json",
        "data": request,
        "success": function(data) {
            var results = new Array();
            for (var index = 0; index < data.result.length; index++) {
                results.push(data.result[index]["统计日期"]);
            }
            $(selector).empty();
            createOptions(selector, results);
            createSummary();
        }
    };
    $.ajax(options);
}
var getHistory = function(date, pname) {
    var request = new QueryRequest("getStatisticalResultHistory", null, date, pname, null);
    var options = {
        "url": url,
        "type": "post",
        "dataType": "json",
        "data": request,
        "success": function(data) {
            var results = new Object();
            results = JSON.parse(data.result)[0];
            createSummary();
            var pname = $("#pname").val();
            if (pname === "小型项目管理系统") {
                updateSummaryLabel("#num_of_published_proj", results["上线项目数"].length);
                updateSummaryTable("#distribution_of_published_proj", results["上线项目分布图"]);
                updateSummaryLabel("#num_of_delayed_proj", results["延期项目数"].length);
                updateSummaryTable("#distribution_of_delayed_proj", results["延期项目分布图"]);
                updateSummaryTable("#distribution_of_delay_reason", results["主要延期原因分布图"]);
                updateSummaryLabel("#num_of_published_proj_with_bug", results["带Bug上线项目数"].length);
                createSummaryIssueId("#num_of_published_proj_with_bug", results["带Bug上线项目数"]);
                updateSummaryLabel("#num_of_published_bug", results["带Bug上线量"].length);
                createSummaryIssueId("#num_of_published_bug", results["带Bug上线量"]);
                updateSummaryLabel("#num_of_bug", results["Bug总数"].length);
                updateSummaryTable("#distribution_of_new_bug", results["新增Bug分布图"]);
                updateSummaryLabel("#num_of_regression_bug", results["回归Bug总数"].length);
                updateSummaryTable("#distribution_of_regression_bug", results["回归Bug分布图"]);
            } else if (pname === "在线问题跟踪系统") {
                updateSummaryLabel("#num_of_new_online_bug", results["新增在线bug数"].length);
                updateSummaryLabel("#num_of_unsolved_online_bug", results["未解决当期在线bug数"].length);
                updateSummaryLabel("#num_of_solved_online_bug_over_one_month", results["未于一个月内解决的在线bug数"].length);
                updateSummaryTable("#distribution_of_solved_online_bug_over_one_month_by_assignee", results["未于一个月内解决的在线Bug_经办人分布"]);
                updateSummaryTable("#distribution_of_solved_online_bug_over_one_month_by_reporter", results["未于一个月内解决的在线Bug_来源分布"]);
                updateSummaryTable("#distribution_of_solved_online_bug_over_one_month_by_month", results["未于一个月内解决的在线Bug_创建时间分布"]);
                updateSummaryTable("#distribution_of_solved_online_bug_over_one_month_by_group", results["未于一个月内解决的在线Bug_项目组分布"]);
                updateSummaryTable("#distribution_of_unreal_online_bug_by_reason", results["当期_明确为非在线bug分类图"]);
                updateSummaryTable("#distribution_of_real_online_bug_by_reason", results["当期_需修复在线bug导致原因分类图"]);
                updateSummaryTable("#distribution_of_real_online_bug_by_modular", results["当期_在线Bug模块分布图"]);
                updateSummaryTable("#distribution_of_real_online_bug_by_group", results["当期_在线Bug项目组分布图"]);
            }
        }
    };
    $.ajax(options);
}
var updateSummaryInfo = function(selector, type, start, end, pname) {
    var request = new QueryRequest(type, start, end, pname);
    // console.log(request);
    var options = {
        "url": url,
        "type": "post",
        "dataType": "json",
        "data": request,
        "success": function(data) {
            var result = data.result;
            if (typeof(result[0].count) !== "undefined") {
                updateSummaryLabel(selector, result[0].count);
            } else if (typeof(result[0].clazz) !== "undefined") {
                updateSummaryTable(selector, result);
            } else {
                createSummaryIssueId(selector, result);
            }
        }
    };
    $.ajax(options);
}
var updateSummaryLabel = function(selector, result) {
    $(selector).html(result);
}
var updateSummaryTable = function(selector, result) {
    var html = "";
    var clazz = (result[0].clazz === null) ? "未分类" : result[0].clazz;
    var template = "<tr><td class='clazz'>{0}</td><td class='count'>{1}</td><td class='ids'>{2}</td></tr>";
    var ids = new Array();
    var count = 0;
    for (var index = 0; index < result.length; index++) {
        if (result[index].clazz === null) {
            result[index].clazz = "未分类";
        }
        if (clazz !== result[index].clazz) {
            html += template.format(clazz, count, ids.toString());
            clazz = result[index].clazz;
            ids = new Array();
            ids.push(result[index].id);
            count = 1;
        } else {
            ids.push(result[index].id);
            count++;
        }
    }
    html += template.format(clazz, count, ids.toString());
    $(selector).html(html);
}
var createSummaryIssueId = function(selector, result) {
    var html = "";
    var template = "<span>{0}</span>";
    for (var index = 0; index < result.length; index++) {
        if (index % 10 == 0) {
            html += "<div>";
        }
        html += template.format(result[index].id);
        if (index % 10 == 9) {
            html += "</div>";
        }
    }
    $(selector).append(html);
}
var createSummaryTitle = function() {
    var template_realtime = "<h3 id='summary_title'>统计结果（{0} ~ {1}）</h3>";
    var template_history = "<h3 id='summary_title'>历史统计（{0}）</h3>";
    var mode = $("input[name='search-mode']:checked").val();
    if (mode === "realtime") {
        var start = $("#start").val();
        var end = $("#end").val();
        $("#summary").append(template_realtime.format(start, end));
    } else if (mode === "history") {
        var end = $("#end").val();
        $("#summary").append(template_history.format(end));
    }
}
var createSPMSSummary = function() {
    createLabel("#summary", "num_of_published_proj", "上线项目数");
    createTable("#summary", "distribution_of_published_proj", "上线项目分布图");
    createLabel("#summary", "num_of_delayed_proj", "延期项目数");
    createTable("#summary", "distribution_of_delay_reason", "主要延期原因分布图");
    createTable("#summary", "distribution_of_delayed_proj", "延期项目分布图");
    createLabel("#summary", "num_of_published_proj_with_bug", "带Bug上线项目数");
    createLabel("#summary", "num_of_published_bug", "带Bug上线量");
    createLabel("#summary", "num_of_bug", "Bug总数");
    createTable("#summary", "distribution_of_new_bug", "新增Bug分布图");
    createLabel("#summary", "num_of_regression_bug", "回归Bug总数");
    createTable("#summary", "distribution_of_regression_bug", "回归Bug分布图");
}
var createOITSSummary = function() {
    createLabel("#summary", "num_of_new_online_bug", "新增在线bug数");
    createLabel("#summary", "num_of_unsolved_online_bug", "未解决当期在线bug数");
    createLabel("#summary", "num_of_solved_online_bug_over_one_month", "未于一个月内解决的在线bug数");
    createTable("#summary", "distribution_of_solved_online_bug_over_one_month_by_assignee", "未于一个月内解决的在线Bug_经办人分布");
    createTable("#summary", "distribution_of_solved_online_bug_over_one_month_by_reporter", "未于一个月内解决的在线Bug_来源分布");
    createTable("#summary", "distribution_of_solved_online_bug_over_one_month_by_month", "未于一个月内解决的在线Bug_创建时间分布");
    createTable("#summary", "distribution_of_solved_online_bug_over_one_month_by_group", "未于一个月内解决的在线Bug_项目组分布");
    createTable("#summary", "distribution_of_unreal_online_bug_by_reason", "当期_明确为非在线bug分类图");
    createTable("#summary", "distribution_of_real_online_bug_by_reason", "当期_需修复在线bug导致原因分类图");
    createTable("#summary", "distribution_of_real_online_bug_by_modular", "当期_在线Bug模块分布图");
    createTable("#summary", "distribution_of_real_online_bug_by_group", "当期_在线Bug项目组分布图");
}
var createSummary = function() {
    $("#summary").empty();
    createSummaryTitle();
    if ($('#pname').find("option:selected").text() === "小型项目管理系统") {
        createSPMSSummary();
    } else if ($('#pname').find("option:selected").text() === "在线问题跟踪系统") {
        createOITSSummary();
    }
};
var updateSPMSSummary = function(start, end, pname) {
    updateSummaryInfo("#num_of_published_proj", 'getNumberOfPublishedProjectFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_published_proj", 'getIssueIdOfPublishedProjectFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_published_proj", 'getDistributionOfPublishedProjectsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_delayed_proj", 'getNumberOfDelayedProjectFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_delayed_proj", 'getIssueIdOfDelayedProjectFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_delayed_proj", 'getDistributionOfDelayedProjectsFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_delay_reason", 'getDistributionOfDelayedReasonFromJira', start, end, pname);
    updateSummaryInfo("#num_of_published_proj_with_bug", 'getNumberOfPublishedPorjectsWithBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_published_proj_with_bug", 'getIssueIdOfPublishedPorjectsWithBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_published_bug", 'getNumberOfPublishedBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_published_bug", 'getIssueIdOfPublishedBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_bug", 'getNumberOfBugsFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_bug", 'getIssueIdOfBugsFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_new_bug", 'getDistributionOfNewBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_regression_bug", 'getNumberOfRegressionBugsFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_regression_bug", 'getIssueIdOfRegressionBugsFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_regression_bug", 'getDistributionOfRegressionBugsFromJira', start, end, pname);
}
var updateOITSSummary = function(start, end, pname) {
    updateSummaryInfo("#num_of_new_online_bug", 'getNumOfNewOnlineBugsFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_new_online_bug", 'getIssueIdOfNewOnlineBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_unsolved_online_bug", 'getNumberOfUnsolvedOnlineBugsFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_unsolved_online_bug", 'getIssueIdOfUnsolvedOnlineBugsFromJira', start, end, pname);
    updateSummaryInfo("#num_of_solved_online_bug_over_one_month", 'getNumberOfSolvedOnlineBugsOverOneMonthFromJira', start, end, pname);
    // updateSummaryInfo("#num_of_solved_online_bug_over_one_month", 'getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_solved_online_bug_over_one_month_by_assignee", 'getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_solved_online_bug_over_one_month_by_reporter", 'getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_solved_online_bug_over_one_month_by_month", 'getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_solved_online_bug_over_one_month_by_group", 'getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_unreal_online_bug_by_reason", 'getDistributionOfUnrealOnlineBugsByReasonFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_real_online_bug_by_reason", 'getDistributionOfRealOnlineBugsByReasonFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_real_online_bug_by_modular", 'getDistributionOfRealOnlineBugsByModularFromJira', start, end, pname);
    updateSummaryInfo("#distribution_of_real_online_bug_by_group", 'getDistributionOfRealOnlineBugsByGroupFromJira', start, end, pname);
}
var updateSummary = function(start, end, pname) {
    $("#summary").empty();
    createSummary();
    if ($('#pname').find("option:selected").text() === "小型项目管理系统") {
        updateSPMSSummary(start, end, pname);
    } else if ($('#pname').find("option:selected").text() === "在线问题跟踪系统") {
        updateOITSSummary(start, end, pname);
    }
}
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
}
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {　　　　　　　　　　　　
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
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
}
$.event.special.valuechange = {
    teardown: function(namespaces) {
        $(this).unbind(".valuechange");
    },
    handler: function(e) {
        $.event.special.valuechange.triggerChanged($(this));
    },
    add: function(obj) {
        $(this).on("keyup.valuechange cut.valuechange paste.valuechange input.valuechange", obj.selector, $.event.special.valuechange.handler)
    },
    triggerChanged: function(element) {
        var current = element[0].contentEditable === "true" ? element.html() : element.val(),
            previous = typeof element.data("previous") === "undefined" ? element[0].defaultValue : element.data("previous")
        if (current !== previous) {
            element.trigger("valuechange", [element.data("previous")])
            element.data("previous", current)
        }
    }
}