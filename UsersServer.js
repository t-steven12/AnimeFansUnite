var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_tieus',
    password        : '6696',
    database        : 'cs340_tieus'
});

module.exports.pool = pool;

var express = require('express');
var cors = require('cors');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 41988);

app.get('/Users',function(req,res,next){
    console.log("Server: retrieving table...");
    var backToRequest = {};
    pool.query('SELECT * FROM Users', function(err, rows){
        if(err){
            next(err);
            return;
        }
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

app.post('/Users',function(req,res,next){
   console.log("Server: inserting new user...");
   var backToRequest = {};
   pool.query('INSERT INTO Users (f_name, l_name) VALUES (?, ?)', [req.body.f_name, req.body.l_name], function(err, result){
       if(err){
           next(err);
           return;
       }
       console.log(result.insertId);
       backToRequest = {user_id: result.insertId, f_name: req.body.f_name, l_name: req.body.l_name};
       console.log(backToRequest);
       backToRequest = JSON.stringify(backToRequest);
       res.send(backToRequest);
   });
});

app.listen(app.get('port'), function(){
    console.log('Server online @ http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});


