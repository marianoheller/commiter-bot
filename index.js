'use strict';
require('dotenv').config()
var express = require('express');
var app = express();
var logger = require('morgan');
var path = require('path');
var cors = require('cors');
var commiter = require('./middleware/commiter');

//CORS
app.use(cors());

// Config
app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));

// General
app.get('/', commiter ,(req, res) => res.sendStatus(200) )

app.listen(3000, () => console.log('Example app listening on port 3000!'))