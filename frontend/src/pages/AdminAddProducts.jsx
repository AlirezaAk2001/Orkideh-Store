import React from "react";
import AddProductForm from "./AddProductForm";

const AdminAddProduct = () => {
  return (
    <div
      className="p-2 sm:p-4 md:p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto"
      dir="rtl"
    >
      <h2
        className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-center"
      >
        افزودن محصول جدید
      </h2>
      <AddProductForm />
    </div>
  );
};

export default AdminAddProduct;