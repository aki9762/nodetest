var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var path= require("path");
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodetest'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/getallemp', function (req,res) {
	connection.query('SELECT * from employee', function(err, rows, fields) {
  		if (!err){
  			var response = [];
			response.push({'result' : 'success'});
			if (rows.length != 0) {
				response.push({'data' : rows});
			} else {
				response.push({'msg' : 'No Result Found'});
			}
 
			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});

app.get('/getemployeecount', function (req,res) {
var allemp = "SELECT * FROM employee";
connection.query(allemp, function(err, rows, fields) {
  if (err) throw err;
  var response = [];

			
				response.push({'result' : 'success', 'count' : rows.length,});
			

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
});
});


app.post('/empwithpagination', function (req,res) {
	var pageNo = req.body.pageNo;
	var recordPerPage = req.body.recordPerPage;
	 console.log("data:", req.body);
	var offset = (pageNo - 1)*recordPerPage ;
	 var row_count = recordPerPage;
	connection.query('SELECT * from employee LIMIT ?,?;', [offset, row_count], function(err, rows, fields) {
		
  		if (!err){
  			var response = [];

			
				response.push({'result' : 'success', 'data' : rows,});
			

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});

app.post('/createemployee', function (req,res) {
	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.emailid !== 'undefined' && 
		typeof req.body.phoneno !== 'undefined'
	) {
		var name = req.body.name, emailid = req.body.emailid, phoneno = req.body.phoneno;

		connection.query('INSERT INTO employee (empName, emailId, phoneno) VALUES(?,?,?)', 
			[name, emailid, phoneno], 
			function(err, result) {
		  		if (!err){
						var response = [];
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}

					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});

	} else {
		var response = [];
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.send(200, JSON.stringify(response));
	}
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Server listening on port ' + app.get('port'));
});