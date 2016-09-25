import { Router } from 'express';
import nodeFunc from '../models/note';

export default ({ config, db }) => {
	let routes = Router();
	// let Node = nodeFunc(db);
	// add middleware here

	// return { routes: routes, node: Node };
	return routes;
}
