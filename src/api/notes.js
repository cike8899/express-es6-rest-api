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
        let {currentCount, countPerPage, currentPage} = req.body;
        let skipCount = 0;
        if (currentCount) {
            skipCount = currentPage;
        } else {
            skipCount = countPerPage * (currentPage - 1);
        }
        (async function () {
            let notes = await Note.findAndCount({
                'include': [Tag],
                'attributes': ['id', 'title', 'excerpt', 'createdAt', 'updatedAt'],
                'limit': countPerPage,
                'offset': skipCount//跳过的条数
            });
            let pageObj = { currentPage: currentPage, total: notes.count };
            let data = { pageObj, rows: notes.rows };
            res.json(data);
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

