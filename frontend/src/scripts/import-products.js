// src/scripts/import-products.js
const fs = require('fs/promises');
const connectDB = require('../lib/mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: 'C:/Users/AM/Desktop/Orkideh Sewing Machine/sewing-store/.env.local' });

async function importProducts() {
  try {
    await connectDB();
    const data = JSON.parse(await fs.readFile('products.json', 'utf8'));
    await Product.insertMany(data);
    console.log('Products imported successfully');
  } catch (error) {
    console.error('Error importing products:', error);
  } finally {
    process.exit();
  }
}

importProducts();