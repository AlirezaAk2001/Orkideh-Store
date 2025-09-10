import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from "./ProductCard";

export default function ProductsSearch({ setIsSearchOpen }) { // Prop برای بستن منو
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        let q = query(productsRef);
        if (searchQuery) {
          q = query(productsRef, where("name", ">=", searchQuery), where("name", "<=", searchQuery + "\uf8ff"));
        }
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="max-w-[1200px] mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 rtl text-right">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        {searchQuery ? `نتایج جستجو برای: ${searchQuery}` : "همه محصولات"}
      </h2>
      {loading ? (
        <p className="text-center text-gray-500 text-base sm:text-lg">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg">محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setIsSearchOpen={setIsSearchOpen} // پاس دادن Prop به ProductCard
            />
          ))}
        </div>
      )}
    </div>
  );
}