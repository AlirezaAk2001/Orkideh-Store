import React, { useState, useEffect } from "react";
import ProductImage from "../pages/ProductImage";
import ProductSummary from "../pages/ProductSummary";
import ProductComments from "../pages/ProductComments";
import SellerBox from "../pages/SellerBox";
import { ChevronDown, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { productId } = useParams(); // دریافت productId از URL
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const [product, setProduct] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // لود دیتای محصول از MongoDB
//   useEffect(() => {
//   const fetchProduct = async () => {
//     try {
//       const res = await fetch(`/api/products?id=${productId}`);
//       if (!res.ok) throw new Error("Failed to fetch product");
//       const data = await res.json();
//       setProduct(data);
//     } catch (error) {
//       console.error("Error fetching product:", error);
//     }
//   };
//   fetchProduct();
// }, [productId]);

useEffect(() => {
  setProduct({
    name: "چرخ خیاطی نمونه",
    price: 1000000,
    discount: 10,
    image: "/img/sample.jpg",
    inventory: 5,
    "Document ID": "test123",
    additionalFeatures: "ویژگی‌های نمونه",
    seller: "فروشگاه نمونه",
    material: "پلاستیک",
    size: "30x20x10",
    weight: "2 کیلوگرم",
    color: "سیاه",
  });
  }, [productId]);

  if (!product) {
    return <div>در حال بارگذاری...</div>;
  }

  const approvedComments = product?.comments?.filter((c) => c.approved === true) || [];
  const totalVotes = approvedComments.length;
  const averageRating =
    totalVotes > 0
      ? (approvedComments.reduce((acc, comment) => acc + (comment.rating || 0), 0) / totalVotes).toFixed(1)
      : 0;
  const inventory = product?.inventory || 0;
  const isOutOfStock = inventory <= 0;

  const renderInventory = () =>
    isOutOfStock
      ? "ناموجود"
      : product.category === "لوازم جانبی"
      ? "موجود"
      : `${inventory.toLocaleString("fa-IR")} عدد`;
  const increaseQuantity = () =>
    (product.category === "لوازم جانبی" || quantity < inventory) && setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = () => {
    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "هشدار",
        text: "برای افزودن محصول به سبد خرید ابتدا باید ثبت نام/ورود کنید!",
        confirmButtonText: "باشه",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => navigate("/login"));
      return;
    }
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
    const discountedPrice = product.discount
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;
    addToCart({ id: product["Document ID"], title: product.name, price: discountedPrice, quantity });
    Swal.fire({
      icon: "success",
      title: "موفقیت",
      text: "!محصول با موفقیت به سبد خرید اضافه شد",
      confirmButtonText: "باشه",
      timer: 3000,
      timerProgressBar: true,
    });
    setIsInCart(true);
  };

  const handleRemoveFromCart = () => {
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
        removeFromCart(product["Document ID"]);
        setIsInCart(false);
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

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      Swal.fire({
        title: "آیا مطمئن هستید؟",
        text: "!این محصول از علاقه‌مندی‌ها حذف خواهد شد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "!بله، حذف کن",
        cancelButtonText: "لغو",
      }).then((result) => {
        if (result.isConfirmed) {
          removeFromFavorites(product["Document ID"]);
          Swal.fire({
            icon: "success",
            title: "موفقیت",
            text: "!محصول از علاقه‌مندی‌ها حذف شد",
            confirmButtonText: "باشه",
            timer: 3000,
            timerProgressBar: true,
          });
          setIsFavorite(false);
        }
      });
    } else {
      addToFavorites({ id: product["Document ID"], name: product.name, price: product.price, image: product.image });
      Swal.fire({
        icon: "success",
        title: "موفقیت",
        text: "!محصول به علاقه‌مندی‌ها اضافه شد",
        confirmButtonText: "باشه",
        timer: 3000,
        timerProgressBar: true,
      });
      setIsFavorite(true);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-start">
        <div className="relative flex justify-center items-center bg-white rounded-lg shadow-lg">
          {product.discount && product.discount > 0 && (
            <div className="absolute top-4 sm:top-6 md:top-7 left-4 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-pink-500 rounded-full -translate-x-1/2 -translate-y-1/2">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs sm:text-sm md:text-base font-bold">
                {product.discount}%
              </span>
            </div>
          )}
          <ProductImage src={product.image} alt={product.name} className="w-full h-40 sm:h-56 md:h-72 lg:h-80 object-contain" />
        </div>
        <div className="space-y-2 sm:space-y-4" dir="rtl">
          <ProductSummary
            name={product.name}
            price={product.price}
            discount={product.discount}
            rating={parseFloat(averageRating)}
            votes={totalVotes}
            description={product.additionalFeatures} // استفاده از additionalFeatures به عنوان توضیحات
            inventory={inventory}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            {!isInCart && !isOutOfStock && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseQuantity}
                    className="w-8 h-8 bg-gray-200 rounded-l-lg hover:bg-gray-300 flex items-center justify-center text-lg"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (product.category === "لوازم جانبی") {
                        if (!isNaN(value) && value >= 1) setQuantity(value);
                      } else if (!isNaN(value) && value >= 1 && value <= inventory) setQuantity(value);
                    }}
                    className="w-12 h-8 text-center border-t border-b border-gray-300"
                    min="1"
                    max={product.category === "لوازم جانبی" ? undefined : inventory}
                  />
                  <button
                    onClick={increaseQuantity}
                    className="w-8 h-8 bg-gray-200 rounded-r-lg hover:bg-gray-300 flex items-center justify-center text-lg"
                    disabled={product.category === "لوازم جانبی" ? false : quantity >= inventory}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-500 text-white py-1 sm:py-2 rounded-lg hover:bg-pink-600 text-sm sm:text-base"
                >
                  افزودن به سبد خرید
                </button>
              </>
            )}
            {isInCart && (
              <div className="flex-1 flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => navigate("/cart")}
                  className="flex-1 bg-pink-500 text-white py-1 sm:py-2 rounded-lg hover:bg-pink-600 text-sm sm:text-base"
                >
                  سبد خرید
                </button>
                <button
                  onClick={handleRemoveFromCart}
                  className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                >
                  <Trash2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                </button>
              </div>
            )}
            {isOutOfStock && (
              <button disabled className="flex-1 bg-gray-400 text-white py-1 sm:py-2 rounded-lg cursor-not-allowed text-sm sm:text-base">
                ناموجود
              </button>
            )}
            <button
              onClick={handleFavoriteToggle}
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center ${
                isFavorite ? "bg-pink-500" : "bg-gray-200"
              } hover:${isFavorite ? "bg-pink-600" : "bg-gray-300"}`}
            >
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-sm sm:text-base text-gray-600">
            <span className="flex items-center gap-1 sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 sm:w-5 h-4 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
              ارسال به سراسر کشور
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 sm:w-5 h-4 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
              ارسال رایگان در تهران
            </span>
          </div>
          <div>
            <SellerBox sellerName={product.seller || "فروشگاه چرخ خیاطی ارکیده"} />
          </div>
          {!isOutOfStock && (
            <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-gray-50 rounded-lg shadow-inner">
              <h4 className="text-sm sm:text-md md:text-lg font-semibold text-gray-700 mb-1">موجودی</h4>
              <p className="text-gray-600">{renderInventory()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-1 sm:mb-2" dir="rtl">
            مشخصات کلی
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-600" dir="rtl">
            <li dir="rtl"><strong>جنس:</strong> {product.material || "نامشخص"}</li>
            <li dir="rtl"><strong>ابعاد:</strong> {product.size || "نامشخص"}</li>
            <li dir="rtl"><strong>وزن:</strong> {product.weight || "نامشخص"}</li>
            {product.color && <li dir="rtl"><strong>رنگ:</strong> {product.color}</li>}
          </ul>
        </div>

        <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg shadow-md">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-gray-700 font-semibold hover:text-pink-500 transition-colors text-sm sm:text-base md:text-lg"
            dir="rtl"
          >
            <span>مشاهده ویژگی‌های بیشتر</span>
            <ChevronDown
              className={`w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          {isExpanded && (
            <div className="mt-1 sm:mt-2 md:mt-4 space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-600" dir="rtl">
              <p><strong>ویژگی‌ها:</strong> {product.additionalFeatures || "بدون توضیحات"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8" dir="rtl">
        <div className="lg:col-span-2">
          <ProductComments productId={product["Document ID"]} />
        </div>
      </div>
    </div>
  );
}