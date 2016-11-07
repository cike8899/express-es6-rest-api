import { Router } from 'express';
import co from 'co';
import TagFunc from '../../models/tag';
import jwtSimple from 'jwt-simple';

const payload = { foo: 'bar' };
const secret = 'xxx';
let token = jwtSimple.encode(payload, secret);

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

    router.post("/gettagsbypage", (req, res, next) => {
        let countPerPage = req.body.countPerPage, currentPage = req.body.currentPage;
        Tag.findAndCountAll({
            'include': [
                {
                    'model': Note
                }
            ],
            'limit': countPerPage,       // 每页多少条
            'offset': countPerPage * (currentPage - 1)// 跳过多少条
        }).then((all) => {
            console.info(all);
            res.json(all);
        });
    });

    router.post("/addtag", (req, res, next) => {
        // Tag.create(req.body).then((ret) => {
        //     console.info(ret);
        //     res.json(ret.dataValues);
        // });
        let countPerPage = req.body.countPerPage; //currentPage = req.body.currentPage;
        let preTotal = req.body.preTotal;//之前的条数
        (async function () {
            let tag = await Tag.create({ name: req.body.name })
            if (tag) {
                let total = preTotal + 1;
                let remainder = total % 5;
                let totalPage;
                if (remainder !== 0) {
                    totalPage = Math.floor(total / countPerPage) + 1;
                } else {
                    totalPage = Math.floor(total / countPerPage);
                }
                let lastTags = await Tag.findAndCountAll({
                    'include': [
                        {
                            'model': Note
                        }
                    ],
                    'limit': countPerPage,       // 每页多少条
                    'offset': countPerPage * (totalPage - 1)// 跳过多少条
                })
                res.json({ data: lastTags, operationType: "add" });
            }
        })()
    });

    router.post("/addbulktags", (req, res, next) => {
        (async function () {
            let tags = await Tag.bulkCreate(req.body);
            res.json(tags);
        })()
    });

    router.post("/deltagbyid/:id", (req, res, next) => {
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
            // let tag = await Tag.findById(Number(req.params.id));
            let tagId = req.params.id;
            let current = req.body.current;//当前页码
            let currentCount = req.body.currentCount;//没删除前，当前页有多少条记录
            let countPerPage = req.body.countPerPage;//每页有多少条记录

            let delRet = await Tag.destroy({ where: { id: tagId } });//直接通过where条件删除数据不需要先查询后删除。

            let ret;
            if (delRet === 1) {

                // let currentTotalPage = req.body.totalPage;
                let skipPage;//需要跳过多少条页面
                if (currentCount === 1) {
                    skipPage = current - 2;
                } else {
                    skipPage = current - 1;
                }

                let lastTags = await Tag.findAndCountAll({
                    'include': [
                        {
                            'model': Note
                        }
                    ],
                    'limit': countPerPage,       // 每页多少条
                    'offset': countPerPage * skipPage// 跳过多少条
                })
                ret = lastTags;
            } else {
                ret = { success: false };
            }
            console.info(ret);
            res.json(ret);
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