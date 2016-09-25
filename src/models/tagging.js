import Sequelize from 'sequelize';

let TaggingFunc = (db) => {
    var Tagging = db.define('tagging',
        {
            'type': {
                'type': Sequelize.INTEGER(),
                'allowNull': false
            }
        }
    );
    return Tagging;
}

export default TaggingFunc;