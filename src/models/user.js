import Sequelize from 'sequelize';

let UserFunc = (db) => {
    let User = db.define('user',
        {
            'name': {
                'type': Sequelize.CHAR(100),
                'allowNull': false,
                'unique': true
            },
            'pwd': {
                'type': Sequelize.CHAR(250),
                'allowNull': false,
                'unique': false
            }
            // deletedAt: 'destroyTime',
            // paranoid: true
        }
    );
    return User;
}

export default UserFunc;