
const express = require('express');
const bodyParser = require('body-parser');

const cron = require('node-cron');
const fs = require('fs'); 
const shell = require('shelljs'); 
const nodemailer = require('nodemailer');
const json2csv=require('json2csv');
const axios = require('axios');
const app = express();

const mongoose = require('mongoose');

var config = require('./config');

const Task = require('./api/models/todoListModel');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ciscotest',{ useNewUrlParser: true, useUnifiedTopology: true  });

var routes = require('./api/routes/todoListRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'dhanjiv.medivision@gmail.com', // generated gmail user
      pass: 'Dhanjiv123' // generated gmail account password
  }
});


    

// cron scheduler 
cron.schedule('00 56 17 * * *', function() {  
  // cronTime: '00 56 17 * * * ' => Will execute on every 5:56 PM      //*/5000 * * * * *

  console.log('---------------------');
  console.log('Running Cron Job');

axios.get(config.databaseUrl).then(resp => {
   //some data
var data = resp.data;

//console.log(data);
//conver the data to CSV with the column names
const csv = json2csv.parse(data);

//console.log(csv);

  let messageOptions = {
    from: 'Dadmin email <dhanjiv.medivision@gmail.com>', // sender address
    to: config.emailTo,
    subject: 'Scheduled tosend csv attached email',
    text: 'Hi there. This email was automatically sent by cron.',
    attachments: [
      {
        filename: "data.csv",
        content: csv
      }
    ]
  };

  transporter.sendMail(messageOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email successfully sent!');
    }
  });

});

});

app.listen(config.port);

console.log('server started on: ' + config.port);
