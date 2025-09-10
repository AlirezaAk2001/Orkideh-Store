import React from "react";
import PersianDate from "persian-date";

const Footer = () => {
  const persianYear = new PersianDate().year();

  return (
    <footer className="bg-gray-800 text-white py-2 sm:py-3 md:py-4">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 text-center">
        <p className="text-xs sm:text-sm md:text-base">
          .فروشگاه چرخ خیاطی ارکیده {persianYear} © - تمامی حقوق محفوظ است
        </p>
      </div>
    </footer>
  );
};

export default Footer;