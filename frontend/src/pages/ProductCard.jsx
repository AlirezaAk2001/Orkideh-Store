import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProductCard({ product, setIsSearchOpen }) {
  const { addToCart } = useCart();
  const [averageRating, setAverageRating] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const price = parseFloat(product.price) || 0;
  const discount = parseFloat(product.discount) || 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(price - (price * discount) / 100)
    : price;
  const inventory = product?.inventory || 0;
  const isOutOfStock = inventory <= 0;

  useEffect(() => {
    const approved = (product.comments || []).filter((c) => c.approved === true);
    const votes = approved.length;
    const avg = votes > 0
    ? (approved.reduce((acc, c) => acc + (c.rating || 0), 0) / votes).toFixed(1) : 0;
    setAverageRating(parseFloat(avg));
    setTotalVotes(votes);

  }, [product.id, product.comments]);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      Swal.fire({
        icon: "warning",
        title: "هشدار",
        text: "این محصول ناموجود است!",
        confirmButtonText: "باشه",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      quantity: 1,
    });
    Swal.fire({
      icon: "success",
      title: "موفقیت",
      text: "!محصول با موفقیت به سبد خرید اضافه شد",
      confirmButtonText: "باشه",
      timer: 3000,
      timerProgressBar: true,
    });
  };

  if (isOutOfStock) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-2 sm:p-3 md:p-4 hover:shadow-xl transition border border-gray-200 w-full">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-lg mb-2 sm:mb-3 opacity-50"
          />
        </div>
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center mb-1 sm:mb-2">
          {product.title}
        </h2>
        <p className="text-red-500 font-semibold text-center mt-1 sm:mt-2">ناموجود</p>
        <Link to={`/product/${product.id}`}>
          <button
            onClick={() => console.log("Navigating to product details for ID:", product.id)}
            className="bg-pink-600 text-white py-1 sm:py-2 md:py-2 rounded w-full text-xs sm:text-sm md:text-base font-medium mt-1 sm:mt-2 hover:bg-pink-700"
          >
            مشاهده جزئیات
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-2 sm:p-3 md:p-4 hover:shadow-xl transition border border-gray-200 w-full">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-lg mb-2 sm:mb-3"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs sm:text-sm md:text-base font-bold px-1 sm:px-2 py-1 rounded-full">
            {discount}% تخفیف
          </div>
        )}
      </div>
      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center mb-1 sm:mb-2">
        {product.title}
      </h2>
      {totalVotes > 0 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base text-gray-500">
          <StarRating rating={averageRating} />
          <span className="text-xs sm:text-sm md:text-base text-gray-600">({averageRating} - {totalVotes} رای)</span>
        </div>
      )}
      <div className="text-right mb-2 sm:mb-3">
        <div className="text-pink-700 text-sm sm:text-base md:text-lg font-bold">
          {finalPrice.toLocaleString("fa-IR")}{' '}
          <span className="text-xs sm:text-sm md:text-base font-normal">تومان</span>
        </div>
        {hasDiscount && (
          <div className="text-gray-500 text-xs sm:text-sm md:text-base line-through">
            {price.toLocaleString("fa-IR")} تومان
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 sm:gap-2">
        <button
          onClick={handleAddToCart}
          className="bg-red-500 text-white py-1 sm:py-2 md:py-2 rounded w-full text-xs sm:text-sm md:text-base font-medium hover:bg-red-600"
        >
          افزودن به سبد خرید
        </button>
        <Link to={`/product/${product.id}`}>
          <button
            onClick={() => console.log("Navigating to product details for ID:", product.id)}
            className="bg-pink-600 text-white py-1 sm:py-2 md:py-2 rounded w-full text-xs sm:text-sm md:text-base font-medium hover:bg-pink-700"
          >
            مشاهده جزئیات
          </button>
        </Link>
      </div>
    </div>
  );
}