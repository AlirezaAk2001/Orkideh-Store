import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { unwrapFields } from "../utils/fsHelpers";
import ProductCard from "./ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // بدون app

//   useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       onAuthStateChanged(auth, async (user) => {
//         setLoading(true); // وقتی شروع به گرفتن دیتا می‌کنیم

//         try {
//           const base = "https://firebase-proxy.alireza-akhoondi1.workers.dev/products";
//           const headers = user ? { Authorization: `Bearer ${await user.getIdToken()}` } : {};
//           const response = await fetch(base, { headers });

//           const data = await response.json();
//           const items = (data.documents || []).map((doc) => ({
//             id: doc.name.split("/").pop(),
//             ...unwrapFields(doc.fields),
//           }));
//           setProducts(items);
//         } catch (error) {
//           console.error("خطا در دریافت محصولات:", error);
//           setProducts([]); // در صورت خطا لیست خالی باشه
//         } finally {
//           setLoading(false); // ✅ فقط بعد از اتمام fetch
//         }
//       });
//     } catch (error) {
//       console.error("خطا در تنظیم listener:", error);
//     }
//   };

//   fetchProducts();
// }, [auth]);

useEffect(() => {
  setProducts([
    { id: "1", name: "چرخ خیاطی نمونه 1", price: 1000000, image: "/img/sample.jpg" },
    { id: "2", name: "چرخ خیاطی نمونه 2", price: 2000000, image: "/img/sample.jpg" },
  ]);
  setLoading(false);
}, []);

  return (
    <div className="max-w-[1200px] mx-auto py-2 sm:py-4 md:py-8 px-2 sm:px-4 rtl text-right">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 md:mb-6 text-gray-800">همه محصولات</h2>

      {loading ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">...در حال بارگذاری</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">.محصولی یافت نشد</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;