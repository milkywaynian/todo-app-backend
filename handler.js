'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.json());
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



app.post('/tasks', function (req,res) {
  // generate a UD 
  const taskID = uuidv4();
  // add UD to body 
  // sen
  const itemToPost = req.body;
  itemToPost.taskID = taskID;
  itemToPost.completed = false;

  console.log('Attempting to insert: ' + JSON.stringify(itemToPost));

  connection.query('INSERT INTO `tasks` SET ?', itemToPost, function (error, results, fields) {
    if(error) {
      console.error('Your query had a problem with inserting a new task', error);
      res.status(500);
      res.json({errorMessage: error});
    } else { 
      res.json({tasks:results}); 
    }
  });
});


app.put('/tasks/:taskID', function (req,res){
  
  const taskID = req.params.taskID;
  
  connection.query('UPDATE `tasks` SET completed = true  WHERE taskID = ?;', taskID, function (error, results, fields) {
    if(error) {
      console.error('Your query had a problem with editing a task', error);
      res.status(500);
      res.json({errorMessage: error});
    } else { 
      res.json({tasks:results}); 
    }

  });
});

app.delete ('/tasks/:taskID', function (req,res) {

  //select a task by task id

  const taskID = req.params.taskID;

  //remove the task from database 

  connection.query('DELETE FROM `tasks` WHERE taskID = ?;',taskID, function (error, results, fields) {
    if(error) {
      console.error('Your query had a problem with deleting a task', error);
      res.status(500);
      res.json({errorMessage: error});
    } else { 
      res.json({tasks:results}); 
    }
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



  