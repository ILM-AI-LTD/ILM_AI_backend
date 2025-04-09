const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', authRoutes); // load auth routes

module.exports = app;