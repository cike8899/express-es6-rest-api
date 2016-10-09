import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import students from './students';
import studentFunc from '../models/student';
import noteFunc from '../models/note';
import tagFunc from '../models/tag';
import taggingFunc from '../models/tagging';


export default ({ config, db }) => {
	let api = Router();

	let Student = studentFunc(db);
	let Note = noteFunc(db);
	let Tag = tagFunc(db);
	let Tagging = taggingFunc(db);

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




	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	api.use('/students', students({ config, db, Student }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		console.info("oooo");
		res.json({ version });
	});

	return api;
}
