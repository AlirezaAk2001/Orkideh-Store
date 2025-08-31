import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";

const Category = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams(); // مثلاً "چرخ-خیاطی" یا "لوازم-جانبی"

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // مپینگ برای تطابق URL با نام‌های دسته‌بندی
        const categoryMapping = {
          "چرخ-خیاطی": "چرخ خیاطی",
          "لوازم-جانبی": "لوازم جانبی",
        };
        const normalizedCategory = categoryMapping[categoryName] || categoryName?.replace("-", " ") || "چرخ خیاطی";
        const q = query(
          collection(db, "products"),
          where("category", "==", normalizedCategory)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (error) {
        console.error("خطا در دریافت محصولات دسته‌بندی:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="max-w-[1200px] mx-auto py-2 sm:py-4 md:py-8 px-2 sm:px-4 md:px-6 rtl text-right">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 md:mb-6 text-gray-800">
        دسته‌بندی: {categoryName?.replace("-", " ") || "چرخ‌خیاطی‌"}
      </h2>

      {loading ? (
        <p dir="rtl" className="text-center text-gray-500 text-base sm:text-lg">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <p dir="rtl" className="text-center text-gray-500 text-base sm:text-lg">محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;