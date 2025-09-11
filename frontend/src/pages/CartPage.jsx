import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";

export default function CartPage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showForm, setShowForm] = useState(false);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   } else {
  //     console.log("User logged in:", user); // برای دیباگ
  //   }
  //   console.log("Cart Items:", cartItems); // دیباگ cartItems
  // }, [user, navigate, cartItems]); // وابستگی‌ها شامل cartItems

  useEffect(() => {
  setShowForm(true); // فرض می‌کنیم کاربر لاگین کرده
  }, []);

  // تنظیمات EmailJS
  // emailjs.init("ZFRSHMt6AzeaL70VO"); // User ID از پنل EmailJS

  const handleSubmitOrder = () => {
    if (!user || !cartItems.length) {
      alert(".سبد خرید خالی است یا کاربر لاگین نکرده است");
      return;
    }
    setShowForm(true);
  };

  // const handleConfirmOrder = async (e) => {
  //   e.preventDefault();
  //   if (!phoneNumber) {
  //     alert(".لطفاً شماره تلفن خود را وارد کنید");
  //     return;
  //   }

  //   try {
  //     const newOrderId = doc(collection(db, "orders")).id;
  //     const totalPrice = cartItems.reduce((sum, item) => {
  //       const itemPrice = parseFloat(item.price) || 0; // تبدیل به عدد
  //       const itemQuantity = item.quantity || 1;
  //       return sum + itemPrice * itemQuantity;
  //     }, 0);
  //     const productNames = cartItems.map((item) => item.title).join(", "); // استفاده از title به‌جای name

  //     const formattedProducts = cartItems.map((item) => ({
  //       name: item.title, // استفاده از title به‌عنوان نام
  //       price: parseFloat(item.price) || 0,
  //       quantity: item.quantity || 1,
  //     }));

  //     // ذخیره سفارش توی Firestore
  //     await setDoc(doc(db, "orders", newOrderId), {
  //       userId: user.uid,
  //       products: formattedProducts,
  //       status: "processing",
  //       createdAt: new Date(),
  //       totalPrice: totalPrice,
  //       phoneNumber: phoneNumber,
  //     });

  //     // ارسال ایمیل با EmailJS
  //     const emailParams = {
  //       to_email: "poshtibani.orkideh@gmail.com",
  //       from_name: "سایت چرخ خیاطی ارکیده",
  //       user_name: user.displayName || "کاربر ناشناس",
  //       phone_number: phoneNumber,
  //       product_names: productNames,
  //       order_id: newOrderId,
  //     };

  //     await emailjs.send("service_bje52sn", "template_xuuiuss", emailParams);

  //     // نمایش SweetAlert
  //     Swal.fire({
  //       icon: "success",
  //       title: "موفقیت!",
  //       text: ".سفارش شما با موفقیت ثبت شد. جهت نهایی کردن سفارش، همکاران ما از تیم پشتیبانی فروشگاه چرخ خیاطی ارکیده با شما تماس خواهند گرفت",
  //       confirmButtonText: "باشه",
  //     }).then(() => {
  //       setShowForm(false);
  //       cartItems.forEach((item) => removeFromCart(item.id));
  //     });
  //   } catch (error) {
  //     console.error("Error details:", error);
  //     alert(".خطا در ثبت سفارش یا ارسال ایمیل. لطفاً دوباره تلاش کنید");
  //   }
  // };

  const handleConfirmOrder = (e) => {
  e.preventDefault();
  if (!phoneNumber) {
    alert(".لطفاً شماره تلفن خود را وارد کنید");
    return;
  }
  alert("این فقط تست UI است. سفارش ثبت نمی‌شود!");
  setShowForm(false);
  };

  const handleRemoveFromCartWithConfirmation = (itemId) => {
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "!این محصول از سبد خرید حذف خواهد شد",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "!بله، حذف کن",
      cancelButtonText: "لغو",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(itemId);
        Swal.fire({
          icon: "success",
          title: "موفقیت",
          text: "!محصول از سبد خرید حذف شد",
          confirmButtonText: "باشه",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">...در حال بارگذاری</div>;
  }

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
  };

  return (
    <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8" dir="rtl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">سبد خرید</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-base sm:text-lg">سبد خرید شما خالی است.</p>
      ) : (
        <>
          <ul className="space-y-2 sm:space-y-3 md:space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-2 sm:p-3 md:p-4 border rounded-lg">
                <span className="text-sm sm:text-base md:text-lg">{item.title || "نام موجود نیست"} (x{item.quantity || 1})</span> {/* استفاده از title */}
                <span className="text-sm sm:text-base md:text-lg">{(parseFloat(item.price) || 0).toLocaleString("fa-IR")} تومان</span>
                <Button
                  onClick={() => handleRemoveFromCartWithConfirmation(item.id)}
                  className="ml-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm"
                >
                  حذف
                </Button>
              </li>
            ))}
          </ul>
          <div className="text-right">
            <p className="text-base sm:text-lg md:text-xl font-semibold">
              مجموع: {calculateTotal().toLocaleString("fa-IR")} تومان
            </p>
          </div>
          <Button onClick={handleSubmitOrder} className="mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm sm:text-base">
            ثبت سفارش
          </Button>

          {showForm && (
            <form onSubmit={handleConfirmOrder} className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md mt-4 sm:mt-6 md:mt-8" dir="rtl">
              <div className="mb-2 sm:mb-3 md:mb-4">
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={user.displayName || "کاربر ناشناس"}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 sm:p-3 md:p-4 bg-gray-100 text-sm sm:text-base"
                />
              </div>
              <div className="mb-2 sm:mb-3 md:mb-4">
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">نام محصول</label>
                <input
                  type="text"
                  value={cartItems.map((item) => item.title).join(", ") || "بدون محصول"} // استفاده از title
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 sm:p-3 md:p-4 bg-gray-100 text-sm sm:text-base"
                />
              </div>
              <div className="mb-2 sm:mb-3 md:mb-4">
                <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700">شماره تلفن همراه</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="مثال: 09123456789"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 sm:p-3 md:p-4"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button type="submit" className="mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base">
                  تأیید
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  className="mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm sm:text-base"
                >
                  لغو
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}