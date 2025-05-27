import { messages } from '../constants/message.js';
import { responseDelivery } from '../helpers/response.js';
import Category from '../models/category.js';

export const find = async (req, res) => {
    const response = await Category.find({ isActive: true, isDeleted: false });
    responseDelivery(res, 200, messages.success, response);
}

export const findOne = async (req, res) => {
    const response = await Category.findById(req.params.categoryId);
    responseDelivery(res, 200, messages.success, response);
}