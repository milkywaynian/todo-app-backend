'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const uuidv4 = require('uuid/v4');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : process.env.db_host,
  user     : process.env.db_user,
  password : process.env.db_password,
  database : process.env.db_database
});




app.get('/tasks', function(req, res) {

  connection.query('SELECT * FROM `tasks` WHERE `userID` = "geoff"', function (error, results, fields) {
    // error will be an Error if one occurred during the query
    if(error) {
      console.error('Your query had a problem with fetching tasks', error);
      res.status(500);
      res.json({errorMessage: error});
    } else { 
      res.json({tasks:results}); 

    }
    // results will contain the results of the query
    // fields will contain information about the returned results fields (if any)
  });


  res.json({
    message: 'Your API works',
  });
});

module.exports.tasks = serverless(app);


// module.exports.tasks = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'My own test message'
//       },
//       null,
//       2
//     ),
//   };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };

