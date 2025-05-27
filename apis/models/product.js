import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    attributes: { type: Object, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('products', productSchema);

productSchema.index({ name: 'text', description: 'text' });

export default Product;