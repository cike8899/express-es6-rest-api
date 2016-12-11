import Sequelize from 'sequelize';

let noteFunc = (db) => {
    let Note = db.define('note',
        {
            'title': {
                'type': Sequelize.CHAR(64),
                'allowNull': false
            },
            'excerpt': {
                'type': Sequelize.TEXT("medium"),
                'allowNull': true
            },
            'content': {
                'type': Sequelize.TEXT("long"),
                'allowNull': false
            }
        }
    );
    return Note;
}

export default noteFunc;