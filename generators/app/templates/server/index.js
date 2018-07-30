const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const app = express();
const api = require('./api/');



if (app.get('env') === 'development') app.use(require('connect-livereload')());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/', api);
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/', (req, res) => res.sendFile('index.html', { root: __dirname }));

logger.info('--- STARTING -----------------------------------------------------');
app.listen(3005, () => logger.info('Server started: http://localhost:3005'));
