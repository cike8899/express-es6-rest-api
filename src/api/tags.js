import resource from 'resource-router-middleware';
import TagFunc from '../models/tag';
import Sequelize from 'sequelize';
import {Router} from 'express';

export default({config, db, Tag}) => {
    let router = Router();

    router.use((req, res, next) => {
        console.info("middleware", req.body);
        next();
    });

    router.get("/", (req, res, next) => {
        res.json(req.body);
    });

    router.get("/getalltag", (req, res, next) => {
        console.info(req.body);
        res.json(req.body)
    });
    router.post("/addtag", (req, res, next) => {
        console.info(req.body);
        res.json(req.body)
    });
    return router;
}