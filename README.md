Express & ES6 REST API Boilerplate
==================================

[![bitHound Score](https://www.bithound.io/github/developit/express-es6-rest-api/badges/score.svg)](https://www.bithound.io/github/developit/express-es6-rest-api)

This is a straightforward boilerplate for building REST APIs with ES6 and Express.

- ES6 support via [babel](https://babeljs.io)
- REST resources as middleware via [resource-router-middleware](https://github.com/developit/resource-router-middleware)
- CORS support via [cors](https://github.com/troygoode/node-cors)
- Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

> Tip: If you are using [Mongoose](https://github.com/Automattic/mongoose), you can automatically expose your Models as REST resources using [restful-mongoose](https://git.io/restful-mongoose).

Getting Started
---------------

```sh
# clone it
git clone https://github.com/cike8899/express-es6-rest-api.git
cd express-es6-rest-api

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start
```
如果不使用vscode调试的话，直接npm run dev,这样文件更改后不需要重启；
使用vscode调试的话就需要先npm run build，已经在tasks.json里面配置好了，
只需要Ctrl+Shift+B就可以将es6的文件编译成es5文件，这样才能在vscode里
调试，vscode的调试方式是run launch,attach现在用不了。

License
-------
MIT
