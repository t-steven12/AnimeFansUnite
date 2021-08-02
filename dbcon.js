var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_tieus',
    password        : '6696',
    database        : 'cs340_tieus'
});

module.exports.pool = pool;
