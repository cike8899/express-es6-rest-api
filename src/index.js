import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import jwt from 'express-jwt';
import session from 'express-session';
import log4js from 'log4js';
import path from 'path';
import RedisStore from 'connect-redis';

var ex = require("express");

let app = express();
app.server = http.createServer(app);

//日志
let logFilePath = __dirname + "/logs/access.log";// dist/logs文件
log4js.configure({
	appenders: [
		{ type: 'console' },
		{ type: 'file', filename: logFilePath, category: 'normal', maxLogSize: 1024 }
	]
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));


// 3rd party middleware app.use(cors({ 	exposedHeaders: config.corsHeaders }));

app.use(cors());

app.use(bodyParser.json({ limit: config.bodyLimit }));

app.use(session({
	secret: "bill",
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000//设置maxAge是60mins，即60mins后session和相应的cookie失效过期
	},
	resave: true,
	saveUninitialized: true
}));

initializeDb(db => {
				// internal middleware
	app.use(middleware({ config, db }));
	app.use((req, res, next) => {
		console.info("res:", res);
		next();
	});
	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
