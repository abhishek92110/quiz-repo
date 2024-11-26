const express = require('express');
const app = express();
const routes = require('./router/router');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// Base path for router
app.use('/', routes);
module.exports = app;
