//The following code is based on the dbcon.js.template from Justin Wolford's "CS-290-Server-Side-Examples" @ https://github.com/wolfordj/CS290-Server-Side-Examples/tree/master/express-mysql

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_tieus',
    password        : '6696',
    database        : 'cs340_tieus'
});

module.exports.pool = pool;
