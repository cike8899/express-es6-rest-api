import Sequelize from 'sequelize';
import { Router } from 'express';

export default ({ config, db, Note, Tag}) => {
    let router = new Router();

    router.get("/getallnotesexcerpt", (req, res, next) => {
        (async function () {
            let notes = await Note.findAll({
                'include': [Tag],
                'attributes': ['id', 'title', 'excerpt', 'createdAt', 'updatedAt']
            });
            res.json(notes)
        })();
    });

    router.post("/getnotesexcerptbypage", (req, res, next) => {
        (async function () {
            let notes = await Node.findAndCount({
                'include': [Tag],
                'attributes': ['id', 'title', 'excerpt', 'createdAt', 'updatedAt'],
                'limit': 20,
                'offset': 0//跳过的条数
            });
            res.json(notes);
        })()
    });

    router.get("/getnotebyid/:id", (req, res, next) => {
        let id = req.params.id;
        (async function () {
            let note = await Note.findById(id, {
                'include': [Tag]
            });
            res.json(note);
        })()
    });

    return router;
}