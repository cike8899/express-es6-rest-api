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
// import redis from 'connect-redis';

// let RedisStore = redis(session);

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

// app.use(session({
// 	store: new RedisStore({
// 		host: '127.0.0.1',
// 		port: 6397,
// 		pass: '',
// 		ttl: 30 * 24 * 60 * 60
// 	}),
// 	secret: "bill",
// 	cookie: {
// 		maxAge: 30 * 24 * 60 * 60 * 1000//设置maxAge是60mins，即60mins后session和相应的cookie失效过期
// 	},
// 	resave: false,
// 	saveUninitialized: true
// }));

initializeDb((db, client) => {
				// internal middleware
	app.use(middleware({ config, db, client }));
	app.use((req, res, next) => {
		console.info("res:", res);
		next();
	});
	// api router
	app.use('/api', api({ config, db, client }));

	app.server.listen(process.env.PORT || config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
