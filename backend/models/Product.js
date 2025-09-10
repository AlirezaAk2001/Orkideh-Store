import mongoose from 'mongoose'; // این خط رو اضافه کن اگر نیست

const productSchema = new mongoose.Schema({
  // فیلدهای شمای محصول شما
  "Document ID": String,
  additionalFeatures: String,
  category: String,
  color: String,
  comments: Array,
  createdAt: Date,
  customId: String,
  dis: String,
  discount: Number,
  finalPrice: Number,
  identifier: String,
  image: String,
  inventory: String,
  material: String,
  name: String,
  price: Number,
  rating: Array,
  size: String,
  title: String,
  weight: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;