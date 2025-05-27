import { Router } from 'express';
import { find, findOne } from '../controllers/category.js';

const router = Router();

router.get('/', find);
router.get('/:categoryId', findOne);


export default router;