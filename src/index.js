import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
var ex = require("express");

let app = express();
app.server = http.createServer(app);

// 3rd party middleware app.use(cors({ 	exposedHeaders: config.corsHeaders }));

app.use(cors());

app.use(bodyParser.json({limit: config.bodyLimit}));

initializeDb(db => {

				// internal middleware
				app.use(middleware({config, db}));
				app.use((req, res, next) => {
								console.info("res:", res);
								next();
				});

				// api router
				app.use('/api', api({config, db}));

				app
								.server
								.listen(process.env.PORT || config.port);

				console.log(`Started on port ${app.server.address().port}`);
});

export default app;
