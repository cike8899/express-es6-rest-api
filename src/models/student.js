import Sequelize from 'sequelize';

// var Student = Sequelize.define('student', {
//     Name: {
//         type: Sequelize.STRING,
//         field: 'name' // Will result in an attribute that is firstName when user facing but first_name in the database
//     },
//     id: {
//         type: Sequelize.INT,
//         field: 'id'
//     }
// }, { 
//         freezeTableName: true // Model tableName will be the same as the model name
//     });

// export default Student;
let studentFunc = (db) => {
    let Student = db.define('student',
        {
            id: {
                type: Sequelize.INTEGER,
                field: 'id',
                primaryKey: true,
                autoIncrement: true
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
        }
    );
    return Student;
}


export default studentFunc;