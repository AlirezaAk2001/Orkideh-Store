import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import Swal from 'sweetalert2';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  const handleRemoveWithConfirmation = (itemId) => {
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این محصول از علاقه‌مندی‌ها حذف خواهد شد!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "!بله، حذف کن",
      cancelButtonText: "لغو",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromFavorites(itemId);
        Swal.fire({
          icon: "success",
          title: "موفقیت",
          text: "!محصول از علاقه‌مندی‌ها حذف شد",
          confirmButtonText: "باشه",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    });
  };

  return (
    <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8" dir='rtl'>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">علاقه‌مندی‌ها</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">هیچ محصولی به علاقه‌مندی‌ها اضافه نشده است.</p>
      ) : (
        <ul className="space-y-2 sm:space-y-3 md:space-y-4">
          {favorites.map((item) => (
            <li key={item.id} className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md flex items-center justify-between">
              <span className="text-base sm:text-lg md:text-xl text-gray-700">{item.name}</span>
              <button
                onClick={() => handleRemoveWithConfirmation(item.id)}
                className="bg-red-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded hover:bg-red-600 text-sm sm:text-base"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;