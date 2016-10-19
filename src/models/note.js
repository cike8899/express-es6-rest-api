import Sequelize from 'sequelize';

let noteFunc = (db) => {
    let Note = db.define('note',
        {
            'title': {
                'type': Sequelize.CHAR(64),
                'allowNull': false
            },
            'content': {
                'type': Sequelize.TEXT("medium"),
                'allowNull': false
            }
        }
    );
    return Note;
}

export default noteFunc;