import React from 'react';
import { FaStore } from 'react-icons/fa';

const SellerBox = ({ sellerName }) => {
  return (
    <div className="border rounded-lg p-2 sm:p-3 md:p-4 bg-gray-50">
      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 text-gray-700">
        <FaStore className="text-blue-500 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">فروشنده</h3>
      </div>
      <p className="text-sm sm:text-base md:text-lg text-gray-600">{sellerName}</p>
    </div>
  );
};

export default SellerBox;