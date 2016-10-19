import NoteFunc from '../../models/note';
import { Router } from 'express';


let adminNote = (config, db, Note, Tag, Tagging) => {
    let router = Router();

    router.get("/getallnote", (req, res, next) => {
        (async function () {
            let notes = await Note.findAll({
                "include": [
                    { "model": Tag }
                ]
            });
            res.json(notes);
        })()
    });

    router.post("/addnote", (req, res, next) => {
        (async function () {
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
            let note = await Note.findById(req.body.id);
            let ret;
            if (note) {
                ret = await note.update({ title: req.body.title, content: req.body.content });
            } else {
                ret = { success: "there is no this note" };
            }
            res.json(ret);
        })()
    });

    return router;
}

export default adminNote;