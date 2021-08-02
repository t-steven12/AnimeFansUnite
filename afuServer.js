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
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set('port', 41988);

app.get('/users',function(req,res,next){
    console.log("Server: retrieving Users table...");
    var backToRequest;
    pool.query('SELECT * FROM Users', function(err, rows){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

app.get('/artists',function(req,res,next){
    console.log("Server: Artists table...");
    var backToRequest;
    pool.query('SELECT * FROM Artists', function(err,rows){
       if(err){
           next(err);
           return;
       }
       console.log(rows);
       backToRequest = JSON.stringify(rows);
       res.send(backToRequest);
    });
});

app.get('/titles',function(req,res,next){
    console.log("Server: getting Titles table...");
    var backToRequest;
    var space = ' ';
    pool.query("SELECT Titles.title_name AS Titles, CONCAT(Artists.f_name, space, Artists.l_name) AS Artists FROM Titles JOIN Artists ON Titles.artist = Artists.artist_id ORDER BY Titles ASC", function(err,rows){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

app.post('/users',function(req,res,next){
   console.log("Server: inserting new user...");
   var backToRequest;
   pool.query('INSERT INTO Users (f_name, l_name) VALUES (?, ?)', [req.body.f_name, req.body.l_name], function(err, result){
       if(err){
           next(err);
           return;
       }
       var idFromInsert = result.insertId;
       pool.query('SELECT * FROM Users WHERE user_id=?', [idFromInsert], function(err, row){
           if(err){
               next(err);
               return;
           }
           backToRequest = JSON.stringify(row);
           console.log(backToRequest);
           res.send(backToRequest);
       });
   });
});

app.post('/artists',function(req,res,next){
    console.log("Server: inserting new artist...");
    var backToRequest;
    pool.query('INSERT INTO Artists (f_name, l_name) VALUES (?,?)', [req.body.f_name, req.body.l_name], function(err,result){
        if(err){
            next(err);
            return;
        }
        var idFromInsert = result.insertId;
        pool.query('SELECT * FROM Artists WHERE artist_id=?', [idFromInsert], function(err, row){
            if(err){
                next(err);
                return;
            }
            backToRequest = JSON.stringify(row);
            console.log(backToRequest);
            res.send(backToRequest);
        });
    });
});

app.listen(app.get('port'), function(){
    console.log('Server online @ http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});


