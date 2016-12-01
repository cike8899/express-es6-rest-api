import { redisClient } from './redis_database';
let TOKEN_EXPIRATION = 60;
let TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

// Middleware for token verification
let verifyToken = function (req, res, next) {
	var token = getToken(req.headers);
	console.info("client:", redisClient);
	// redisClient.get(token, function (err, reply) {
	// 	if (err) {
	// 		console.log(err);
	// 		return res.send(500);
	// 	}

	// 	if (reply) {
	// 		res.send(401);
	// 	}
	// 	else {
	// 		next();
	// 	}

	// });

	redisClient.getAsync(token).then((ret) => {
		console.info(ret);
		if (ret === "") {
			next();
		} else {
			res.send(401);
		}
	}, (err) => {
		res.send(500);
	});
};

let expireToken = function (headers) {
	var token = getToken(headers);

	if (token != null) {
		redisClient.set(token, { is_expired: true });
		redisClient.expire(token, TOKEN_EXPIRATION_SEC);
	}
};

let saveToken = function (token) {
	redisClient.set(token, "");
	redisClient.expire(token, TOKEN_EXPIRATION_SEC);
}

let removeToken = function (headers) {
	let token = getToken(headers);
	return redisClient.delAsync(token);
}

let getToken = function (headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split(' ');

		if (part.length == 2) {
			var token = part[1];

			return part[1];
		}
		else {
			return null;
		}
	}
	else {
		return null;
	}
};

export {
	verifyToken,
	expireToken,
	saveToken,
	removeToken,
	TOKEN_EXPIRATION,
	TOKEN_EXPIRATION_SEC
}
