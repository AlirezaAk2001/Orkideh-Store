import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

export default async function handler(req, res) {
  await connectDB();

  const { method, query } = req;

  if (method === "GET") {
    try {
      const { id } = query; // گرفتن id از query
      if (id) {
        const product = await Product.findOne({ "Document ID": id });
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
      }

      const products = await Product.find({});
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}