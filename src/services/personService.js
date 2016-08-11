import restfulMongoose from 'restful-mongoose';

// any mongoose Model:
import Persons from '../models/person';

// create and export a Router, mount it anywhere via .use()
export default restfulMongoose('Persons', Persons);