import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import students from './students';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	api.use('/students', students({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		console.info("oooo");
		res.json({ version });
	});

	return api;
}
