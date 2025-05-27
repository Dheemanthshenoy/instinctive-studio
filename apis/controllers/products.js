import { messages } from '../constants/message.js';
import { responseDelivery } from '../helpers/response.js';
import Product from '../models/product.js';
import Category from '../models/category.js';

export const find = async (req, res) => {
    const response = await Product.find({ isActive: true, isDeleted: false });
    responseDelivery(res, 200, messages.success, response);
}

export const findOne = async (req, res) => {
    const response = await Product.findById(req.params.productId);
    responseDelivery(res, 200, messages.success, response);
}

export const search = async (req, res) => {
    const { q, category, stock } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const queryFilters = req.query.filters ? JSON.parse(decodeURIComponent(req.query.filters)) : {};

    let sort = { createdAt: -1 };
    let query = { isActive: true, isDeleted: false };

    if (q) {
        query = { ...query, $text: { $search: q } };
        sort = { score: { $meta: 'textScore' } };
    }

    if (stock) {
        switch (stock) {
            case 'in-stock':
                query.stock = { $gt: 0 };
                break;
            case 'out-of-stock':
                query.stock = 0;
                break;
            case 'low-stock':
                query.stock = { $lte: 10, $gt: 0 };
        }
    }

    if (category) {
        query.category = category;
    }

    if (Object.keys(queryFilters).length > 0) {
        const attributeConditions = Object.entries(queryFilters)
            .reduce((acc, [key, value]) => {
                acc[`attributes.${key}`] = value;
                return acc;
            }, {});

        query = { ...query, ...attributeConditions };
    }

    const categoryQuery = { ...query }
    if (categoryQuery.category) {
        delete categoryQuery.category;
    }

    const [
        rawResponse,
        rawCategories
    ] = await Promise.all([
        Product.aggregate([
            { $match: query },
            ...(q ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),
            { $sort: sort },
            {
                $facet: {
                    products: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    totalProducts: [
                        { $count: 'total' },
                    ],
                    filters: [
                        { $project: { attributes: { $objectToArray: "$attributes" } } },
                        { $unwind: "$attributes" },
                        { $group: { _id: { key: "$attributes.k", value: "$attributes.v" }, count: { $sum: 1 } } },
                        { $group: { _id: "$_id.key", values: { $push: { value: "$_id.value", count: "$count" } } } },
                        { $project: { key: "$_id", type: 'radio', values: { $sortArray: { input: '$values', sortBy: { value: 1 } } }, _id: 0 } },
                        { $sort: { key: 1 } }
                    ]
                }
            }
        ]),
        Product.aggregate([
            { $match: categoryQuery },
            ...(q ? [{ $addFields: { score: { $meta: "textScore" } } }] : []),
            { $sort: sort },
            { $group: { _id: "$category", totalProducts: { $sum: 1 } } },
            { $project: { _id: 0, category: "$_id", totalProducts: 1 } },
            { $sort: { totalProducts: -1 } }
        ])
    ])

    const response = rawResponse[0];
    const products = response.products || [];
    const totalProducts = response.totalProducts[0] ? response.totalProducts[0].total : 0;
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = page;
    const nextPage = page < totalPages ? page + 1 : 1;
    const prevPage = page > 1 ? page - 1 : 1;
    const isLastPage = page === totalPages;
    const rawFilters = response.filters || [];
    let filters = []
    let categories = rawCategories || [];

    if (rawFilters && rawFilters.length) {
        rawFilters.forEach(filter => {
            filters.push({
                name: `${filter.key.charAt(0).toUpperCase()}${filter.key.slice(1).toLowerCase()}`,
                ...filter,
            })
        })
    }

    if (categories.length) {
        const categoryIdentifiers = categories.map(category => category.category);
        const categoryDocs = await Category.find({ slug: { $in: categoryIdentifiers } });
        const categoryMap = new Map(categoryDocs.map(doc => [doc.slug, doc]));

        categories = categories.map(category => {
            return {
                ...category,
                name: categoryMap.get(category.category).name,
            }
        });
    }

    responseDelivery(res, 200, messages.success, {
        products,
        totalProducts,
        totalPages,
        currentPage,
        limit,
        nextPage,
        prevPage,
        isLastPage,
        filters,
        categories
    });
}