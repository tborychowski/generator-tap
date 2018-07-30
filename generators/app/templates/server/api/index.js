const express = require('express');
const api = express.Router();


api.use('/items', require('./items'));


api.get('/', (req, res) => res.send('Hello from API!'));

module.exports = api;
