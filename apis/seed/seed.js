import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from '../models/category.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import Product from '../models/product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME'];

const missingVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

const connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const options = ['Categories', 'Products'];
let selectedIndex = 0;

// Set up raw input mode
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Clear console and render options
const renderOptions = () => {
    console.clear();
    console.log('Which one do you want to seed? Use ↑ ↓ and press Enter:\n');
    options.forEach((option, index) => {
        if (index === selectedIndex) {
            console.log(`> \x1b[36m${option}\x1b[0m`); // Cyan color
        } else {
            console.log(`  ${option}`);
        }
    });
};

renderOptions();

const connectToMongoDB = async () => {
    await mongoose.connect(connectionString).then(() => {
        console.log(chalk.green('🚀 Connected to MongoDB'));
    }).catch(err => {
        console.error(chalk.red('❌ Error connecting to MongoDB', err));
        process.exit(1);
    });
}

// Handle keypress
process.stdin.on('keypress', async (str, key) => {
    if (key.name === 'up') {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        renderOptions();
    } else if (key.name === 'down') {
        selectedIndex = (selectedIndex + 1) % options.length;
        renderOptions();
    } else if (key.name === 'return') {
        rl.close();
        process.stdin.setRawMode(false);
        const selected = options[selectedIndex].toLowerCase();

        console.log(`\n✅ You selected: ${options[selectedIndex]}`);

        // Validate and load JSON
        const isValid = ['categories', 'products'].includes(selected);
        if (!isValid) {
            console.error("❌ Invalid argument. Please use 'categories' or 'products'");
            process.exit(1);
        }

        await connectToMongoDB();

        try {
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, `${selected}.json`), 'utf-8'));
            console.log(`📦 Loaded ${selected}.json successfully!`);

            if (selected === 'categories') {
                console.log(chalk.yellow('🔄 Seeding categories...'));
                const categories = data.categories;
                const categoryItems = categories.map(category => category.name);
                const categoryDocs = await Category.find({ name: { $in: categoryItems } });

                let categoriesMap = {};
                categoryDocs.forEach(doc => {
                    categoriesMap[doc.name] = doc._id;
                });

                for (const category of categories) {
                    if (categoriesMap[category.name]) {
                        console.log(`📦 ${category.name} already exists!`);
                    } else {
                        try {
                            const newCategory = new Category(category);
                            await newCategory.save();
                            console.log(`📦 ${category.name} created successfully!`);
                        } catch (err) {
                            console.error(`❌ Failed to create ${category.name}:`, err.message);
                        }
                    }
                }

                console.log(chalk.green('✅ Seeding categories completed!'));
                mongoose.disconnect();
                process.exit(0);
            } else if (selected === 'products') {
                console.log(chalk.yellow('🔄 Seeding products...'));
                const products = data.products;
                const productItems = products.map(product => product.name);
                const productDocs = await Product.find({ name: { $in: productItems } });

                let productsMap = {};
                productDocs.forEach(doc => {
                    productsMap[doc.name] = doc._id;
                });

                for (const product of products) {
                    if (productsMap[product.name]) {
                        console.log(`📦 ${product.name} already exists!`);
                    } else {
                        try {
                            const newProduct = new Product(product);
                            await newProduct.save();
                            console.log(`📦 ${product.name} created successfully!`);
                        } catch (err) {
                            console.error(`❌ Failed to create ${product.name}:`, err.message);
                        }
                    }
                }

                console.log(chalk.green('✅ Seeding products completed!'));
                mongoose.disconnect();
                process.exit(0);
            }
        } catch (err) {
            console.error(`❌ Failed to load ${selected}.json:`, err.message);
        }

        process.exit(0);
    } else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
        console.log('\n🚪 Exiting...');
        rl.close();
        process.exit(0);
    }
});
