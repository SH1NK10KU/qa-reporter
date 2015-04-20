/**
 * @author Shin Feng
 *
 * 后端服务
 */
var Wind = require('wind');
var pool = require('./pool');
var mongo = require('./mongo');
var dateformater = require('./dateformater.js');
QAReporterService = {
    getQueryResults: function(dbname, sql, params, callback) {
        pool.query(dbname, sql, params, function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            if (results.length > 0) {
                callback(results);
            }
            return;
        });
    },
    getNumberOfPublishedProjectFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间'";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfPublishedProjectFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfDelayedProjectFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND  jiraissue.DUEDATE < DATE_FORMAT(customfieldvalue.DATEVALUE, '%Y-%m-%d 00:00:00')";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfDelayedProjectFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND  jiraissue.DUEDATE < DATE_FORMAT(customfieldvalue.DATEVALUE, '%Y-%m-%d 00:00:00') ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfPublishedPorjectsWithBugsFromJira: function(values) {
        var sql = "SELECT count(distinct CONCAT(project.pkey, '-', jiraissue.issuenum)) AS count  FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID RIGHT JOIN issuelink ON jiraissue.ID = issuelink.SOURCE LEFT JOIN jiraissue ji ON ji.ID = issuelink.DESTINATION WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND ji.RESOLUTIONDATE IS NULL";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfPublishedPorjectsWithBugsFromJira: function(values) {
        var sql = "SELECT distinct CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID RIGHT JOIN issuelink ON jiraissue.ID = issuelink.SOURCE LEFT JOIN jiraissue ji ON ji.ID = issuelink.DESTINATION WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND ji.RESOLUTIONDATE IS NULL ORDER BY id";
        var params = [values.start, values.end, values.pname, values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfPublishedBugsFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID RIGHT JOIN issuelink ON jiraissue.ID = issuelink.SOURCE LEFT JOIN jiraissue ji ON ji.ID = issuelink.DESTINATION WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND ji.RESOLUTIONDATE IS NULL";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfPublishedBugsFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', ji.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID RIGHT JOIN issuelink ON jiraissue.ID = issuelink.SOURCE LEFT JOIN jiraissue ji ON ji.ID = issuelink.DESTINATION WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND ji.RESOLUTIONDATE IS NULL ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfBugsFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '缺陷(Sub)'";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfBugsFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '缺陷(Sub)' ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfRegressionBugsFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE customfield.cfname = 'Regression') AS regression ON jiraissue.ID = regression.ISSUE WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '缺陷(Sub)' AND regression.customvalue = '是'";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfRegressionBugsFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE customfield.cfname = 'Regression') AS regression ON jiraissue.ID = regression.ISSUE WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '缺陷(Sub)' AND regression.customvalue = '是' ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfPublishedProjectsFromJira: function(values) {
        var sql = "SELECT belonging_group.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE customfield.cfname = '项目组') AS belonging_group ON jiraissue.ID = belonging_group.ISSUE WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' ORDER BY clazz, id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfDelayedProjectsFromJira: function(values) {
        var sql = "SELECT belonging_group.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE customfield.cfname = '项目组') AS belonging_group ON jiraissue.ID = belonging_group.ISSUE WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND jiraissue.DUEDATE < DATE_FORMAT(customfieldvalue.DATEVALUE, '%Y-%m-%d 00:00:00') ORDER BY clazz, id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfDelayedReasonFromJira: function(values) {
        var sql = "SELECT delay_reason.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE cfname = '延期主要原因') AS delay_reason ON jiraissue.ID = delay_reason.ISSUE WHERE customfieldvalue.DATEVALUE BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '小型项目' AND customfield.cfname = '项目实际结束时间' AND jiraissue.DUEDATE < DATE_FORMAT(customfieldvalue.DATEVALUE, '%Y-%m-%d 00:00:00') ORDER BY clazz, id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfNewBugsFromJira: function(values) {
        var sql = "SELECT project_group.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuelink ON jiraissue.ID = issuelink.DESTINATION LEFT JOIN jiraissue ji ON issuelink.SOURCE = ji.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE cfname = '项目组') AS project_group ON ji.ID = project_group.ISSUE WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '缺陷(Sub)' ORDER BY clazz , id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfRegressionBugsFromJira: function(values) {
        var sql = "SELECT project_group.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuelink ON jiraissue.ID = issuelink.DESTINATION LEFT JOIN jiraissue ji ON issuelink.SOURCE = ji.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE cfname = '项目组') AS project_group ON ji.ID = project_group.ISSUE LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE customfield.cfname = 'Regression') AS regression ON jiraissue.ID = regression.ISSUE WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuetype.pname = '缺陷(Sub)' AND regression.customvalue = '是' ORDER BY clazz , id;";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumOfNewOnlineBugsFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ?";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfNewOnlineBugsFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfUnsolvedOnlineBugsFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuestatus.pname != 'Closed'";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfUnsolvedOnlineBugsFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND issuestatus.pname != 'Closed' ORDER BY id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getNumberOfSolvedOnlineBugsOverOneMonthFromJira: function(values) {
        var sql = "SELECT COUNT(*) AS count FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID WHERE jiraissue.CREATED < ? AND project.pname = ? AND issuestatus.pname != 'Closed'";
        var params = [values.start, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira: function(values) {
        var sql = "SELECT CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID WHERE jiraissue.CREATED < ? AND project.pname = ? AND issuestatus.pname != 'Closed'";
        var params = [values.start, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira: function(values) {
        var sql = "SELECT assignee.display_name AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID LEFT JOIN cwd_user AS assignee ON jiraissue.ASSIGNEE = assignee.user_name WHERE jiraissue.CREATED < ? AND project.pname = ? AND issuestatus.pname != 'Closed' AND assignee.directory_id='10000' ORDER BY clazz , id";
        var params = [values.start, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira: function(values) {
        var sql = "SELECT reporter.display_name AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID LEFT JOIN cwd_user AS reporter ON jiraissue.REPORTER = reporter.user_name WHERE jiraissue.CREATED < ? AND project.pname = ? AND issuestatus.pname != 'Closed' AND reporter.directory_id='10000' ORDER BY clazz , id";
        var params = [values.start, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira: function(values) {
        var sql = "SELECT DATE_FORMAT(jiraissue.CREATED, '%Y%m') AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID WHERE jiraissue.CREATED < ? AND project.pname = ? AND issuestatus.pname != 'Closed' ORDER BY clazz , id";
        var params = [values.start, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira: function(values) {
        var sql = "SELECT tester.display_name AS clazz,CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID LEFT JOIN cwd_user AS tester ON customfieldvalue.STRINGVALUE = tester.user_name WHERE jiraissue.CREATED < ? AND project.pname = ? AND issuestatus.pname != 'Closed' AND customfield.cfname = '测试负责人' AND tester.directory_id = '10000' ORDER BY clazz , id";
        var params = [values.start, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfUnrealOnlineBugsByReasonFromJira: function(values) {
        var sql = "SELECT reject_reason.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN (SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE cfname = '退回原因（PD）' UNION SELECT customfieldvalue.ISSUE, customfieldoption.customvalue FROM customfieldvalue LEFT JOIN customfield ON customfieldvalue.CUSTOMFIELD = customfield.ID LEFT JOIN customfieldoption ON customfieldvalue.STRINGVALUE = customfieldoption.ID WHERE cfname = '退回原因（QA）') AS reject_reason ON jiraissue.ID = reject_reason.ISSUE WHERE jiraissue.CREATED  BETWEEN ? AND ? AND project.pname = ? AND reject_reason.customvalue IN ('描述不完整','无法重现','无需修复','问题重复') ORDER BY clazz, id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfRealOnlineBugsByReasonFromJira: function(values) {
        var sql = "SELECT reason.customvalue AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID LEFT JOIN customfieldoption AS reason ON customfieldvalue.STRINGVALUE = reason.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND customfield.cfname = '导致原因' ORDER BY clazz , id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfRealOnlineBugsByModularFromJira: function(values) {
        var sql = "SELECT component.cname AS clazz, CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN nodeassociation ON jiraissue.ID = nodeassociation.SOURCE_NODE_ID LEFT JOIN component ON nodeassociation.SINK_NODE_ID = component.ID WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? ORDER BY clazz , id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getDistributionOfRealOnlineBugsByGroupFromJira: function(values) {
        var sql = "SELECT tester.display_name AS clazz,CONCAT(project.pkey, '-', jiraissue.issuenum) AS id FROM jiraissue LEFT JOIN project ON jiraissue.PROJECT = project.ID LEFT JOIN issuetype ON jiraissue.issuetype = issuetype.ID LEFT JOIN issuestatus ON jiraissue.issuestatus = issuestatus.ID INNER JOIN customfieldvalue ON jiraissue.id = customfieldvalue.issue LEFT JOIN customfield ON customfieldvalue.customfield = customfield.ID LEFT JOIN cwd_user AS tester ON customfieldvalue.STRINGVALUE = tester.user_name WHERE jiraissue.CREATED BETWEEN ? AND ? AND project.pname = ? AND customfield.cfname = '测试负责人' AND tester.directory_id = '10000' ORDER BY clazz , id";
        var params = [values.start, values.end, values.pname];
        return {
            sql: sql,
            params: params
        };
    },
    getRequestResults: function(req, res) {
        var type = req.body.type;
        var values = JSON.parse(req.body.values);
        var query = new Object();
        switch (type) {
            case 'getNumberOfPublishedProjectFromJira':
                query = this.getNumberOfPublishedProjectFromJira(values);
                break;
            case 'getIssueIdOfPublishedProjectFromJira':
                query = this.getIssueIdOfPublishedProjectFromJira(values);
                break;
            case 'getNumberOfDelayedProjectFromJira':
                query = this.getNumberOfDelayedProjectFromJira(values);
                break;
            case 'getIssueIdOfDelayedProjectFromJira':
                query = this.getIssueIdOfDelayedProjectFromJira(values);
                break;
            case 'getNumberOfPublishedPorjectsWithBugsFromJira':
                query = this.getNumberOfPublishedPorjectsWithBugsFromJira(values);
                break;
            case 'getIssueIdOfPublishedPorjectsWithBugsFromJira':
                query = this.getIssueIdOfPublishedPorjectsWithBugsFromJira(values);
                break;
            case 'getNumberOfPublishedBugsFromJira':
                query = this.getNumberOfPublishedBugsFromJira(values);
                break;
            case 'getIssueIdOfPublishedBugsFromJira':
                query = this.getIssueIdOfPublishedBugsFromJira(values);
                break;
            case 'getNumberOfBugsFromJira':
                query = this.getNumberOfBugsFromJira(values);
                break;
            case 'getIssueIdOfBugsFromJira':
                query = this.getIssueIdOfBugsFromJira(values);
                break;
            case 'getNumberOfRegressionBugsFromJira':
                query = this.getNumberOfRegressionBugsFromJira(values);
                break;
            case 'getIssueIdOfRegressionBugsFromJira':
                query = this.getIssueIdOfRegressionBugsFromJira(values);
                break;
            case 'getDistributionOfPublishedProjectsFromJira':
                query = this.getDistributionOfPublishedProjectsFromJira(values);
                break;
            case 'getDistributionOfDelayedProjectsFromJira':
                query = this.getDistributionOfDelayedProjectsFromJira(values);
                break;
            case 'getDistributionOfDelayedReasonFromJira':
                query = this.getDistributionOfDelayedReasonFromJira(values);
                break;
            case 'getDistributionOfNewBugsFromJira':
                query = this.getDistributionOfNewBugsFromJira(values);
                break;
            case 'getDistributionOfRegressionBugsFromJira':
                query = this.getDistributionOfRegressionBugsFromJira(values);
                break;
            case 'getNumOfNewOnlineBugsFromJira':
                query = this.getNumOfNewOnlineBugsFromJira(values);
                break;
            case 'getIssueIdOfNewOnlineBugsFromJira':
                query = this.getIssueIdOfNewOnlineBugsFromJira(values);
                break;
            case 'getNumberOfUnsolvedOnlineBugsFromJira':
                query = this.getNumberOfUnsolvedOnlineBugsFromJira(values);
                break;
            case 'getIssueIdOfUnsolvedOnlineBugsFromJira':
                query = this.getIssueIdOfUnsolvedOnlineBugsFromJira(values);
                break;
            case 'getNumberOfSolvedOnlineBugsOverOneMonthFromJira':
                query = this.getNumberOfSolvedOnlineBugsOverOneMonthFromJira(values);
                break;
            case 'getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira':
                query = this.getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira(values);
                break;
            case 'getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira':
                query = this.getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira(values);
                break;
            case 'getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira':
                query = this.getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira(values);
                break;
            case 'getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira':
                query = this.getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira(values);
                break;
            case 'getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira':
                query = this.getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira(values);
                break;
            case 'getDistributionOfUnrealOnlineBugsByReasonFromJira':
                query = this.getDistributionOfUnrealOnlineBugsByReasonFromJira(values);
                break;
            case 'getDistributionOfRealOnlineBugsByReasonFromJira':
                query = this.getDistributionOfRealOnlineBugsByReasonFromJira(values);
                break;
            case 'getDistributionOfRealOnlineBugsByModularFromJira':
                query = this.getDistributionOfRealOnlineBugsByModularFromJira(values);
                break;
            case 'getDistributionOfRealOnlineBugsByGroupFromJira':
                query = this.getDistributionOfRealOnlineBugsByGroupFromJira(values);
                break;
            case 'getStatisticalResultHistory':
                this.getStatisticalResultHistory(values, res);
                return;
            case 'getHistoryDate':
                this.getHistoryDate(values, res);
                return;
        }
        this.getQueryResults('jiradb', query.sql, query.params, function(results) {
            res.json({
                result: results
            });
            // return;
        });
    },
    syncStatisticalResultFromJira: function() {
        var SPMSStatisticalResult = {
            "统计日期": "",
            "上线项目数": new Array(),
            "上线项目分布图": new Array(),
            "延期项目数": new Array(),
            "延期项目分布图": new Array(),
            "主要延期原因分布图": new Array(),
            "带Bug上线项目数": new Array(),
            "带Bug上线量": new Array(),
            "Bug总数": new Array(),
            "新增Bug分布图": new Array(),
            "回归Bug总数": new Array(),
            "回归Bug分布图": new Array()
        };
        var OITSStatisticalResult = {
            "统计日期": "",
            "新增在线bug数": new Array(),
            "未解决当期在线bug数": new Array(),
            "未于一个月内解决的在线bug数": new Array(),
            "未于一个月内解决的在线Bug_经办人分布": new Array(),
            "未于一个月内解决的在线Bug_来源分布": new Array(),
            "未于一个月内解决的在线Bug_创建时间分布": new Array(),
            "未于一个月内解决的在线Bug_项目组分布": new Array(),
            "当期_明确为非在线bug分类图": new Array(),
            "当期_需修复在线bug导致原因分类图": new Array(),
            "当期_在线Bug模块分布图": new Array(),
            "当期_在线Bug项目组分布图": new Array()
        };
        var end = dateformater.getToday();
        var start = dateformater.getLastMonthDate();
        var syncDate = new Date();
        var valuesOfSPMS = {
            start: start,
            end: end,
            pname: '小型项目管理系统'
        };
        SPMSStatisticalResult['统计日期'] = syncDate.format("yyyy-MM-dd hh:mm:ss");;
        var valuesOfOITS = {
            start: start,
            end: end,
            pname: '在线问题跟踪系统'
        };
        OITSStatisticalResult['统计日期'] = syncDate.format("yyyy-MM-dd hh:mm:ss");
        var Task = Wind.Async.Task;
        var getIssueIdOfPublishedProjectFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfPublishedProjectFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['上线项目数'] = results;
            });
        }));
        var getIssueIdOfDelayedProjectFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfDelayedProjectFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['延期项目数'] = results;
            });
        }));
        var getIssueIdOfPublishedPorjectsWithBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfPublishedPorjectsWithBugsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['带Bug上线项目数'] = results;
            });
        }));
        var getIssueIdOfPublishedBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfPublishedBugsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['带Bug上线量'] = results;
            });
        }));
        var getIssueIdOfBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfBugsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['Bug总数'] = results;
            });
        }));
        var getIssueIdOfRegressionBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfRegressionBugsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['回归Bug总数'] = results;
            });
        }));
        var getDistributionOfPublishedProjectsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfPublishedProjectsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['上线项目分布图'] = results;
            });
        }));
        var getDistributionOfDelayedProjectsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfDelayedProjectsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['延期项目分布图'] = results;
            });
        }));
        var getDistributionOfDelayedReasonFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfDelayedReasonFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['主要延期原因分布图'] = results;
            });
        }));
        var getDistributionOfNewBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfNewBugsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['新增Bug分布图'] = results;
            });
        }));
        var getDistributionOfRegressionBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfRegressionBugsFromJira(valuesOfSPMS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                SPMSStatisticalResult['回归Bug分布图'] = results;
            });
        }));
        var getIssueIdOfNewOnlineBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfNewOnlineBugsFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['新增在线bug数'] = results;
            });
        }));
        var getIssueIdOfUnsolvedOnlineBugsFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfUnsolvedOnlineBugsFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['未解决当期在线bug数'] = results;
            });
        }));
        var getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['未于一个月内解决的在线bug数'] = results;
            });
        }));
        var getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['未于一个月内解决的在线Bug_经办人分布'] = results;
            });
        }));
        var getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['未于一个月内解决的在线Bug_来源分布'] = results;
            });
        }));
        var getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['未于一个月内解决的在线Bug_创建时间分布'] = results;
            });
        }));
        var getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['未于一个月内解决的在线Bug_项目组分布'] = results;
            });
        }));
        var getDistributionOfUnrealOnlineBugsByReasonFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfUnrealOnlineBugsByReasonFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['当期_明确为非在线bug分类图'] = results;
            });
        }));
        var getDistributionOfRealOnlineBugsByReasonFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfRealOnlineBugsByReasonFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['当期_需修复在线bug导致原因分类图'] = results;
            });
        }));
        var getDistributionOfRealOnlineBugsByModularFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfRealOnlineBugsByModularFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['当期_在线Bug模块分布图'] = results;
            });
        }));
        var getDistributionOfRealOnlineBugsByGroupFromJira = eval(Wind.compile("async", function() {
            var query = QAReporterService.getDistributionOfRealOnlineBugsByGroupFromJira(valuesOfOITS);
            QAReporterService.getQueryResults('jiradb', query.sql, query.params, function(results) {
                OITSStatisticalResult['当期_在线Bug项目组分布图'] = results;
            });
        }));
        var insertIntoMongo = eval(Wind.compile("async", function() {
            mongo.insert('qareportdb', 'SPMS', SPMSStatisticalResult, function() {
                console.log('SPMS sync');
            });
            mongo.insert('qareportdb', 'OITS', OITSStatisticalResult, function() {
                console.log('OITS sync');
            })
        }));
        var task = eval(Wind.compile("async", function() {
            $await(Task.whenAll(getIssueIdOfPublishedProjectFromJira(), getIssueIdOfDelayedProjectFromJira(), getIssueIdOfPublishedPorjectsWithBugsFromJira(), getIssueIdOfPublishedBugsFromJira(), getIssueIdOfBugsFromJira(), getIssueIdOfRegressionBugsFromJira(), getDistributionOfPublishedProjectsFromJira(), getDistributionOfDelayedProjectsFromJira(), getDistributionOfDelayedReasonFromJira(), getDistributionOfNewBugsFromJira(), getDistributionOfRegressionBugsFromJira(), getIssueIdOfNewOnlineBugsFromJira(), getIssueIdOfUnsolvedOnlineBugsFromJira(), getIssueIdOfSolvedOnlineBugsOverOneMonthFromJira(), getDistributionOfSolvedOnlineBugsOverOneMonthByAssigneeFromJira(), getDistributionOfSolvedOnlineBugsOverOneMonthByReporterFromJira(), getDistributionOfSolvedOnlineBugsOverOneMonthByMonthFromJira(), getDistributionOfSolvedOnlineBugsOverOneMonthByGroupFromJira(), getDistributionOfUnrealOnlineBugsByReasonFromJira(), getDistributionOfRealOnlineBugsByReasonFromJira(), getDistributionOfRealOnlineBugsByModularFromJira(), getDistributionOfRealOnlineBugsByGroupFromJira()));
            $await(Wind.Async.sleep(60000));
            $await(insertIntoMongo());
        }));
        task().start();
    },
    getStatisticalResultHistory: function(values, res) {
        var date = values.end;
        var pname = values.pname;
        var collection = '';
        if (pname === '小型项目管理系统') {
            collection = 'SPMS';
        } else if (pname === '在线问题跟踪系统') {
            collection = 'OITS';
        }
        mongo.find('qareportdb', collection, {
            "统计日期": date
        }, {}, function(docs) {
            res.json({
                result: JSON.stringify(docs)
            })
        });
    },
    getHistoryDate: function(values, res) {
        var pname = values.pname;
        var collection = '';
        if (pname === '小型项目管理系统') {
            collection = 'SPMS';
        } else if (pname === '在线问题跟踪系统') {
            collection = 'OITS';
        }
        mongo.find('qareportdb', collection, {}, {
            "统计日期": 1,
            "_id": 0
        }, function(docs) {
            res.json({
                result: docs
            })
        });
    }
};
// QAReporterService.syncStatisticalResultFromJira();
module.exports = QAReporterService;