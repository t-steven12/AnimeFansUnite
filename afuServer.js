var mysql = require('./dbcon.js');


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
    mysql.pool.query('SELECT * FROM Users', function(err, rows){
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
    mysql.pool.query('SELECT * FROM Artists', function(err,rows){
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
    mysql.pool.query("SELECT Titles.title_name AS Titles, CONCAT(Artists.f_name, ' ', Artists.l_name) AS Artists FROM Titles LEFT JOIN Artists ON Titles.artist = Artists.artist_id ORDER BY Titles ASC", function(err,rows){
        if(err){
            next(err);
            return;
        }
        //console.log(rows);
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

app.get('/animes',function(req,res,next){
    console.log("Server: getting Animes table...");
    var backToRequest;
    mysql.pool.query("SELECT Animes.anime_id AS AnimeID, Titles.title_name AS Title, CONCAT(Artists.f_name, ' ', Artists.l_name) AS Artist FROM Animes JOIN Titles ON Animes.title = Titles.title_name JOIN Artists ON Titles.artist = Artists.artist_id ORDER BY AnimeID ASC", function(err,rows){
        if(err){
            next(err);
            return;
        }
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

app.post('/fav_animes',function(req,res,next){
    console.log("Server: getting user's favorite animes...");
    var backToRequest;
    mysql.pool.query("SELECT Fav_animes.user_id AS UserID, Fav_animes.anime_id AS AnimeID, Titles.title_name AS AnimeTitle FROM Fav_animes JOIN Animes ON Fav_animes.anime_id = Animes.anime_id JOIN Titles ON Animes.title = Titles.title_name WHERE Fav_animes.user_id = ? ORDER BY AnimeTitle ASC", [req.body.userId], function(err,rows){
        if(err){
            next(err);
            return;
        }
        backToRequest = JSON.stringify(rows);
        res.send(backToRequest);
    });
});

app.post('/favoritingAnime',function(req,res,next){
    console.log("Server: favoriting an anime for user...");
    var backToRequest;
    mysql.pool.query("INSERT INTO Fav_animes (user_id, anime_id) VALUES (?,?)", [req.body.uId, req.body.aId], function(err,result){
        if(err){
            next(err);
            return;
        }
        console.log("ID: " + result.insertId);
        mysql.pool.query("SELECT Fav_animes.user_id AS UserID, Fav_animes.anime_id AS AnimeID, Animes.title AS AnimeTitle FROM Fav_animes JOIN Animes ON Fav_animes.anime_id = Animes.anime_id WHERE Fav_animes.user_id=? AND Fav_animes.anime_id=?", [req.body.uId, req.body.aId], function(err, row){
            backToRequest = JSON.stringify(row);
            console.log(backToRequest);
            res.send(backToRequest);
        });
    });
});

app.post('/animes',function(req,res,next){
    console.log("Server: inserting new anime...");
    var backToRequest;
    mysql.pool.query("INSERT INTO Animes (title) VALUES (?)", [req.body.title], function(err,result){
        if(err){
            next(err);
            return;
        }
        var insertedId = result.insertId;
        mysql.pool.query("SELECT Animes.anime_id AS AnimeID, Titles.title_name AS Title, CONCAT(Artists.f_name, ' ', Artists.l_name) AS Artist FROM Animes LEFT JOIN Titles ON Animes.title = Titles.title_name LEFT JOIN Artists ON Titles.artist = Artists.artist_id WHERE Animes.anime_id=?", [insertedId], function(err,row){
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

app.post('/titles',function(req,res,next){
    console.log("Server: inserting new title...");
    var backToRequest;
    console.log(req.body.title_name);
    console.log(req.body.artist);
    console.log(req.body);
    if(req.body.artist === '') {
        mysql.pool.query("INSERT INTO Titles (title_name, artist) VALUES (?, NULL)", [req.body.title_name], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            mysql.pool.query("SELECT Titles.title_name AS Titles, Titles.artist AS Artists FROM Titles WHERE Titles.title_name=?", [req.body.title_name], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
    else
    {
        console.log("You are in the else-statement.");
        mysql.pool.query("INSERT INTO Titles (title_name, artist) VALUES (?, (SELECT artist_id FROM Artists WHERE CONCAT(Artists.f_name, ' ', Artists.l_name)=? OR Artists.f_name=?))", [req.body.title_name, req.body.artist, req.body.artist], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            mysql.pool.query("SELECT Titles.title_name AS Titles, Artists.f_name AS ArtistFName, Artists.l_name AS ArtistLName FROM Titles JOIN Artists ON Titles.artist = Artists.artist_id  WHERE Titles.title_name=?", [req.body.title_name], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
});

app.post('/users',function(req,res,next){
   console.log("Server: inserting new user...");
   var backToRequest;
   mysql.pool.query('INSERT INTO Users (f_name, l_name) VALUES (?, ?)', [req.body.f_name, req.body.l_name], function(err, result){
       if(err){
           next(err);
           return;
       }
       var idFromInsert = result.insertId;
       mysql.pool.query('SELECT * FROM Users WHERE user_id=?', [idFromInsert], function(err, row){
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
    if(req.body.l_name === '')
    {
        mysql.pool.query('INSERT INTO Artists (f_name, l_name) VALUES (?,NULL)', [req.body.f_name], function(err,result){
            if(err){
                next(err);
                return;
            }
            var idFromInsert = result.insertId;
            mysql.pool.query('SELECT * FROM Artists WHERE artist_id=?', [idFromInsert], function(err, row){
                if(err){
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
    else {
        mysql.pool.query('INSERT INTO Artists (f_name, l_name) VALUES (?,?)', [req.body.f_name, req.body.l_name], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            var idFromInsert = result.insertId;
            mysql.pool.query('SELECT * FROM Artists WHERE artist_id=?', [idFromInsert], function (err, row) {
                if (err) {
                    next(err);
                    return;
                }
                backToRequest = JSON.stringify(row);
                console.log(backToRequest);
                res.send(backToRequest);
            });
        });
    }
});

app.listen(app.get('port'), function(){
    console.log('Server online @ http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});


