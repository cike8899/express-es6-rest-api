import NoteFunc from '../../models/note';
import { Router } from 'express';
import { isContentContainExcerpt, truncateContent } from '../../utils/excerpt';
import secret from '../../config/secret';
import { verifyToken } from '../../config/token_manager';
import jwt from 'express-jwt';


let adminNote = (config, db, Note, Tag, Tagging) => {
    let router = Router();

    router.get("/getallnote", jwt({ secret: secret, credentialsRequired: false }), verifyToken, (req, res, next) => {
        (async function () {
            let notes = await Note.findAll({
                "include": [
                    { "model": Tag }
                ],
                "order": [["updatedAt", "DESC"]]
            });
            res.json(notes);
        })()
    });

    router.post("/getnotesbypage", (req, res, next) => {
        // let currentCount = req.body.currentCount;
        // let countPerPage = req.body.countPerPage;
        // let currentPage = req.body.currentPage;
        let {currentCount, countPerPage, currentPage} = req.body;
        let skipCount = 0;
        if (currentCount) {
            skipCount = currentPage;
        } else {
            skipCount = countPerPage * (currentPage - 1);
        }
        (async function () {
            let notes = await Note.findAndCountAll({
                'include': [
                    {
                        'model': Tag
                    }
                ],
                'limit': countPerPage,       // 每页多少条
                'offset': skipCount,// 跳过多少条
                "order": [["updatedAt", "DESC"]]
            });
            res.json(notes);
        })()
    });

    router.post("/addnote", (req, res, next) => {
        (async function () {
            let {note, ret} = await addnote(req, res, next, Note, Tag);
            note.dataValues.tags = ret ? ret : [];
            res.json(note);
        })()

    });

    router.get("/delnotebyid/:id", (req, res, next) => {
        (async function () {
            let id = req.params.id;
            let note = await Note.findById(Number(id));
            if (note) {
                await note.setTags([]);
                let ret = await note.destroy();
                res.json(ret);
            } else {
                res.json({ success: "there is no this note" });
            }
        })()
    });

    router.post("/updatenote", (req, res, next) => {
        (async function () {
            // let note = await Note.findById(req.body.id);
            // if (note) {
            //     ret = await note.update({ title: req.body.title, content: req.body.content });
            // } else {
            //     ret = { success: "there is no this note" };
            // }
            let {note, ret} = await updatenote(req, res, next, Note, Tag);
            res.json(ret);//更新成功后返回[1]
        })()
    });

    router.post("/upsertnote", (req, res, next) => {
        let val = req.body;
        (async function () {
            // let ret = await Note.upsert(val);//insert 返回 true,update 返回false,并不能返回插入后受影响的行数
            let obj, ret;
            if (val.id) {//更新
                obj = await updatenote(req, res, next, Note, Tag, Tagging);
                ret = { isAdd: false, ret: obj.ret, isContainExcerpt: obj.isContainExcerpt };
            } else {//插入
                obj = await addnote(req, res, next, Note, Tag, Tagging);
                let note = obj.note.dataValues;
                note.tags = obj.ret ? obj.ret : [];
                ret = { isAdd: true, note: note, isContainExcerpt: obj.isContainExcerpt };
            }
            res.json(ret);
        })();
    });

    return router;
}

async function addnote(req, res, next, Note, Tag, Tagging) {
    let reqData = req.body;
    let note = null;
    let ret = null;
    let isContainExcerpt;

    if (isContentContainExcerpt(reqData.content)) {
        isContainExcerpt = true;
        let excerpt = truncateContent(reqData.content);
        reqData.excerpt = excerpt;
        note = await Note.create(reqData);
        // let tagList = req.body.tags;
        // let tagArr = [];
        // if (tagList && tagList.length !== 0) {
        //     let tags = await Tag.findAll();
        //     if (tags && tags.length !== 0) {
        //         for (let item of tagList) {
        //             if (!tags.some(x => x.name === item.name)) {
        //                 tagArr.push(item);
        //             }
        //         }
        //     } else {
        //         tagArr = tagList;
        //     }
        //     if (tagArr.length !== 0) {
        //         let newTags = await Tag.bulkCreate(tagArr, { individualHooks: true });
        //         ret = await note.addTags(newTags, { "type": 2 });
        //     }
        // }
        if (note) {
            let taggings = [];
            let tagArr = req.body.tags;
            tagArr.forEach(x => {
                taggings.push({
                    type: 2,
                    noteId: note.id,
                    tagId: x.id
                });
            });
            try {
                let taggingRet = await Tagging.bulkCreate(taggings, { individualHooks: true });
                if (taggingRet) {
                    ret = tagArr;
                }
                // let taggingRet = await note.addTags(tagArr, { type: 2 });
                // console.info(taggingRet);
            } catch (error) {
                console.info(error);
            }
        }
    } else {
        isContainExcerpt = false;
    }


    return { note, ret, isContainExcerpt };
}

async function updatenote(req, res, next, Note, Tag, Tagging) {
    let ret = null, note = null, isContainExcerpt = null;
    // if (note) {
    //     ret = await note.update({ title: req.body.title, content: req.body.content });
    // } else {
    //     ret = { success: "there is no this note" };
    // }
    let con = req.body.content;
    // let tags = req.body.tags;
    if (isContentContainExcerpt(con)) {
        isContainExcerpt = true;
        let excerpt = truncateContent(con);
        note = await Note.update({//返回1
            title: req.body.title,
            content: req.body.content,
            excerpt: excerpt
        }, { where: { id: req.body.id } });

        // let tagsRet = await note.addTags(tags, { "type": 2 });

        if (note) {
            let taggings = [];
            let tagArr = req.body.tags;
            tagArr.forEach(x => {
                taggings.push({
                    type: 2,
                    noteId: req.body.id,
                    tagId: x.id
                });
            });
            try {
                Tagging.bulkCreate(taggings, { individualHooks: true });
            } catch (error) {
                console.info(error);
            }
            ret = note;
        } else {
            ret = { success: "there is no this note" };
        }
    } else {
        isContainExcerpt = false;
    }

    return { note, ret, isContainExcerpt };
}

function bindTagsToNote(Note, Tag) {

}

export default adminNote;