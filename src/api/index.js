import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import students from './students';

import studentFunc from '../models/student';
import noteFunc from '../models/note';
import tagFunc from '../models/tag';
import taggingFunc from '../models/tagging';
import userFunc from '../models/user';

import authFunc from './auth/auth';
import initSessionToken from './auth/initSessionToken';

import tags from './tags';
import adminRouter from './admin/admin';

import session from 'express-session';

export default ({ config, db }) => {
	let api = Router();

	let Student = studentFunc(db);
	let Note = noteFunc(db);
	let Tag = tagFunc(db);
	let Tagging = taggingFunc(db);
	let User = userFunc(db);

	Note.belongsToMany(Tag, { through: Tagging });
	Tag.belongsToMany(Note, { through: Tagging });

	Note.sync().then((ret) => {
		console.info(ret);
	});
	Tag.sync().then((ret) => {
		console.info(ret);
	});

	Tagging.sync().then((ret) => {
		console.info(ret);
	});

	User.sync().then((ret) => {
		console.info(ret);
	});

	// api.use("/admin/*", initSessionToken);//初始化session的token
	// api.use(/^((?!user).)*$/, authFunc(api));//匹配不包含user路由的字符串
	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	api.use('/students', students({ config, db, Student }));
	api.use('/tags', tags({ config, db, Tag }));

	api.use('/admin', adminRouter(config, db, { Note: Note, Tag: Tag, Tagging: Tagging, User: User }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		console.info("oooo");
		res.json({ version });
	});

	return api;
}
