import { Router } from 'express';
import adminTag from './adminTag';

let router = Router();

router.use("/tag", adminTag);

export default router