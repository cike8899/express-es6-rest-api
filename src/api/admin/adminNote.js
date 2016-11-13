import NoteFunc from '../../models/note';
import { Router } from 'express';


let adminNote = (config, db, Note, Tag, Tagging) => {
    let router = Router();

    router.get("/getallnote", (req, res, next) => {
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
        let countPerPage = req.body.countPerPage;
        let currentPage = req.body.currentPage;
        (async function () {
            let notes = await Note.findAndCountAll({
                'include': [
                    {
                        'model': Tag
                    }
                ],
                'limit': countPerPage,       // 每页多少条
                'offset': countPerPage * (currentPage - 1),// 跳过多少条
                "order": [["updatedAt", "DESC"]]
            });
            res.json(notes);
        })()
    });

    router.post("/addnote", (req, res, next) => {
        (async function () {
            let {note, ret} = await addnote(req, res, next, Note, Tag);
            res.json({ note: note, tags: ret });
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
                obj = await updatenote(req, res, next, Note, Tag);
                ret = { isAdd: false, ret: obj.ret };
            } else {//插入
                obj = await addnote(req, res, next, Note, Tag);
                ret = { isAdd: true, note: { note: obj.note, tags: obj.ret } };
            }
            res.json(ret);
        })();
    });

    return router;
}

async function addnote(req, res, next, Note, Tag) {
    let note = await Note.create(req.body);
    let tagList = req.body.tagList;
    let tagArr = [];
    let ret = null;
    if (tagList && tagList.length !== 0) {
        let tags = await Tag.findAll();
        if (tags && tags.length !== 0) {
            for (let item of tagList) {
                if (!tags.some(x => x.name === item.name)) {
                    tagArr.push(item);
                }
            }
        } else {
            tagArr = tagList;
        }
        if (tagArr.length !== 0) {
            let newTags = await Tag.bulkCreate(tagArr, { individualHooks: true });
            ret = await note.addTags(newTags, { "type": 2 });
        }
    }
    return { note, ret };
}

async function updatenote(req, res, next, Note, Tag) {
    let ret;
    // if (note) {
    //     ret = await note.update({ title: req.body.title, content: req.body.content });
    // } else {
    //     ret = { success: "there is no this note" };
    // }
    let note = await Note.update({//返回1
        title: req.body.title,
        content: req.body.content
    }, { where: { id: req.body.id } });

    if (note) {
        ret = note;
    } else {
        ret = { success: "there is no this note" };
    }
    return { note, ret };
}

export default adminNote;