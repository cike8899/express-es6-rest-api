import { Router } from 'express';

let router = Router();

router.get("/", (req, res, next) => {
    console.info(req.body);
    res.json(req.body)
});

router.get("/getalltag", (req, res, next) => {
    console.info(req.body);
    res.json([{ name: "jj" }])
});

export default router