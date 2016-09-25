import Sequelize from 'sequelize';

let TagFunc = (db) => {
    let Tag = db.define('tag',
        {
            'name': {
                'type': Sequelize.CHAR(64),
                'allowNull': false,
                'unique': true
            }
        }
    );
    return Tag;
}

export default TagFunc;