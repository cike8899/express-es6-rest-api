import Sequelize from 'sequelize';

export default callback => {
	// connect to a database if needed, the pass it to `callback`:
	var sequelize = new Sequelize('stumanager', 'root', '123456', {
		host: 'localhost',
		dialect: 'mariadb',
		'port': 3307,

		pool: {
			max: 5,
			min: 0,
			idle: 10000
		},

		// SQLite only
		// storage: 'path/to/database.sqlite'
	});

	// Or you can simply use a connection uri
	// var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

	// connect to db

	callback(sequelize);
}
