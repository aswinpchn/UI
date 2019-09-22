var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var mysql = require('mysql');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  database : 'grubhub' 
});
 
connection.connect((error) => {  // If you don't put this callback, app won't crash.
  if(error)
    console.log(error);
});

// connection.query is a callbacl type one, so instead of putting inside a prime, we can return things from it stand-alone as return.

let dbCall = (query) => {
  var callPromise = new Promise ((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if(error)
      {
        reject(error);
      }
      resolve(results);
    });
  }); 

  return callPromise;
}

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

app.get('/user/:id', (req, res) => {
  
  if(!req.params.id)
  {
    res.writeHead(400);
    res.end("Wrong parameters");
  } else {
    let user = req.params.id;

    let responsePromise = dbCall(`select * from user where id=${user}`);
    responsePromise.then((response) => {

      if(response.length !== 1) {
        throw "no user";
      }

      res.writeHead(200, {  // //res.type('json')  // This also will work similar to setting content type application/json
        'Content-type' : 'application/json'
      });
      res.end(JSON.stringify(response[0]));    // We can't send JSON directly we have to change it to string using stringify

    }).catch((error) => {
      if(error == "no user") {
        res.writeHead(404);
        res.end("User not found");
      } else {
        res.writeHead(500);
        res.end("DB error");
      }
    });
  }
});

app.listen(3001);
console.log("Server Listening on port 3001");