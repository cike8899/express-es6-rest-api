import { Router } from 'express';
import adminTag from './adminTag';
import adminNote from './adminNote';
import noteFunc from '../../models/note';
import tagFunc from '../../models/tag';
import taggingFunc from '../../models/tagging';

let adminRouter = (config, db, entity) => {
    let router = Router();

    router.use("/tag", adminTag(config, db, entity.Tag, entity.Note));
    router.use("/note", adminNote(config, db, entity.Note, entity.Tag, entity.Tagging));

    return router;
}

export default adminRouter