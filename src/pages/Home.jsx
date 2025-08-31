import React from "react";
import { Link } from "react-router-dom";
import BannerSlider from "./BannerSlider";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <BannerSlider />
      {/* بنر بالا */}
      <div className="bg-white shadow-lg py-4 sm:py-6 md:py-10 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 md:mb-2">
          فروشگاه چرخ خیاطی ارکیده
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">فروش و تعمیرات تخصصی چرخ خیاطی و لوازم جانبی</p>
        <Link to="/products">
          <button className="mt-2 sm:mt-3 md:mt-6 bg-pink-600 text-white px-4 sm:px-5 md:px-6 py-1 sm:py-2 md:py-2 rounded-lg hover:bg-pink-700 transition text-sm sm:text-base">
            مشاهده محصولات
          </button>
        </Link>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4 md:mb-6 text-right">
          دسته‌بندی‌ها
        </h2>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-center items-center gap-4 sm:gap-6 md:gap-10">
          {/* دسته‌بندی ۱ */}
          <Link
            to="/category/چرخ-خیاطی"
            className="bg-white shadow rounded-lg p-4 sm:p-6 md:p-8 hover:shadow-md transition flex flex-col items-center justify-center h-60 sm:h-72 md:h-96 w-60 sm:w-72 md:w-96"
          >
            <img
              src="/img/sewing-machine.png"
              alt="چرخ خیاطی"
              className="w-full h-36 sm:h-44 md:h-56 object-contain mb-2 sm:mb-3 md:mb-4"
            />
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 text-center">
              چرخ خیاطی
            </h3>
          </Link>

          {/* دسته‌بندی ۲ */}
          <Link
            to="/category/لوازم-جانبی"
            className="bg-white shadow rounded-lg p-4 sm:p-6 md:p-8 hover:shadow-md transition flex flex-col items-center justify-center h-60 sm:h-72 md:h-96 w-60 sm:w-72 md:w-96"
          >
            <img
              src="/img/accessories.png"
              alt="لوازم جانبی"
              className="w-full h-36 sm:h-44 md:h-56 object-contain mb-2 sm:mb-3 md:mb-4"
            />
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 text-center">
              لوازم جانبی
            </h3>
          </Link>
        </div>
      </div>
    </div>
  );
}