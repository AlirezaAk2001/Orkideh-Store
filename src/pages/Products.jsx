import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from './ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (error) {
        console.error('خطا در دریافت محصولات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;