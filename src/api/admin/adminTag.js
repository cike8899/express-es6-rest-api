import { Router } from 'express';
import co from 'co';
import TagFunc from '../../models/tag';

let adminTag = (config, db, Tag, Note) => {
    let router = Router();

    router.get("/", (req, res, next) => {
        console.info(req.body);
        res.json(req.body)
    });

    router.get("/getalltag", (req, res, next) => {
        Tag.findAll({
            'include': [
                {
                    'model': Note
                }
            ]
        }).then((all) => {
            console.info(all);
            res.json(all);
        });
    });

    router.post("/addtag", (req, res, next) => {
        Tag.create(req.body).then((ret) => {
            console.info(ret);
            res.json(ret.dataValues);
        });
    });

    router.post("/addbulktags", (req, res, next) => {
        (async function () {
            let tags = await Tag.bulkCreate(req.body);
            res.json(tags);
        })()
    });

    router.get("/deltagbyid/:id", (req, res, next) => {
        // co(function* (params) {
        //     let tag = yield Tag.findById(Number(req.params.id));
        //     let ret = yield tag.destroy();
        //     console.info(ret);
        //     req.json(ret);
        //     console.info(req.params);
        // }).catch(function (e) {
        //     console.info(e);
        // })

        async function asyncDelTag() {
            let tag = await Tag.findById(Number(req.params.id));
            let ret = await tag.destroy();
            console.info(ret);
            req.json(ret);
            console.info(req.params);
        }
        asyncDelTag();
    });

    router.post("/updatetagname", (req, res, next) => {
        (async function () {
            let body = req.body;
            let tag = await Tag.findById(body.id);
            if (tag) {
                let newTag = await tag.update({ name: req.body.name });
                res.json(newTag);
            } else {
                res.json({ flag: "can not found this tag" });
            }
        })()
    });

    return router;
}

export default adminTag