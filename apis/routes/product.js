import { Router } from 'express';
import { find, findOne } from '../controllers/products.js';

const router = Router();

router.get('/', find);
router.get('/:productId', findOne);

export default router;