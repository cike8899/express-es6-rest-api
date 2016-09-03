import resource from 'resource-router-middleware';
import students from '../models/student';
import Sequelize from 'sequelize';

export default ({ config, db }) => resource({

    /** Property name to store preloaded entity on `request`. */
    id: 'student',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
    load(req, id, callback) {
        let facet = students.find(facet => facet.id === id),
            err = facet ? null : 'Not found';
        callback(err, facet);
    },

    /** GET / - List all entities */
    index({ params }, res) {
        var Student = db.define('student', {
            id: {
                type: Sequelize.INTEGER,
                field: 'id',
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                field: 'name' // Will result in an attribute that is firstName when user facing but first_name in the database
            },
            age: {
                type: Sequelize.INTEGER,
                field: 'age' // Will result in an attribute that is firstName when user facing but first_name in the database
            }
        },
            {
                freezeTableName: true // Model tableName will be the same as the model name
            });
        Student.findAll().then(function (all) {
            console.info(all);
            res.json(all);
        });
        // Student.findOne().then(function (s) {
        //     console.info(s);
        // });

        // students.findOne().then(function (user) {
        //     console.log(user.get('firstName'));
        // });
        // res.json([{ name: "kkk" }]);
    },

    /** POST / - Create a new entity */
    create({ body }, res) {
        body.id = students.length.toString(36);
        students.push(body);
        res.json(body);
    },

    /** GET /:id - Return a given entity */
    read({ facet }, res) {
        res.json(facet);
    },

    /** PUT /:id - Update a given entity */
    update({ facet, body }, res) {
        for (let key in body) {
            if (key !== 'id') {
                facet[key] = body[key];
            }
        }
        res.sendStatus(204);
    },

    /** DELETE /:id - Delete a given entity */
    delete({ facet }, res) {
        students.splice(students.indexOf(facet), 1);
        res.sendStatus(204);
    }
});