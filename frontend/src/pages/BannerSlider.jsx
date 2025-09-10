// src/components/BannerSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const banners = [
  {
    img: '/img/banner1.jpg',
    title: 'جدیدترین چرخ‌خیاطی‌های ژانومه',
    desc: '!تخفیف ویژه فقط تا پایان هفته',
  },
  {
    img: '/img/banner2.png',
    title: 'چرخ‌خیاطی دیجیتال نیولایف',
    desc: 'ارسال رایگان به سراسر کشور',
  },
  {
    img: '/img/banner3.png',
    title: 'Youshita ۷۵۵ سردوز',
    desc: '!هم‌اکنون با قیمت استثنایی',
  },
];

const BannerSlider = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto mt-2 sm:mt-4 md:mt-6 rounded-xl overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="rounded-xl"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[180px] sm:h-[250px] md:h-[350px] lg:h-[420px]">
              <img
                src={banner.img}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-2 sm:px-4 md:px-6 lg:px-12 text-white transition-opacity duration-700 ease-in-out sm:text-right text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold animate-fadeInUp">
                  {banner.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 animate-fadeInUp delay-150">
                  {banner.desc}
                </p>
                <Link to="/products">
                  <button className="mt-2 sm:mt-3 md:mt-4 bg-pink-600 hover:bg-pink-700 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full w-fit shadow-lg transition-transform duration-300 hover:scale-105 text-xs sm:text-sm md:text-base">
                    خرید
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;