import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User2, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // state جدید

  // کلیک روی آیکون آدمک یا دکمه ورود
  const handleUserClick = () => {
    if (loading) return;
    if (!currentUser) {
      navigate("/login");
    } else {
      if (currentUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  };

  // لود realtime محصولات از Firestore
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
  //     const productsData = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setProducts(productsData);
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
  setProducts([
    { id: "1", name: "چرخ خیاطی نمونه 1", image: "/img/sample.jpg" },
    { id: "2", name: "چرخ خیاطی نمونه 2", image: "/img/sample.jpg" },
  ]);
  }, []);

  // لود اطلاعات کاربر و عکس پروفایل
  // useEffect(() => {
  //   if (currentUser) {
  //     const userDocRef = doc(db, "users", currentUser.uid);
  //     const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         setProfileImageUrl(userData.profileImageUrl || null);
  //       } else {
  //         setProfileImageUrl(null);
  //       }
  //     });
  //     return () => unsubscribe();
  //   } else {
  //     setProfileImageUrl(null);
  //   }
  // }, [currentUser]);

  useEffect(() => {
  setProfileImageUrl("/img/default-profile.jpg"); // یه تصویر پیش‌فرض
  }, []);

  // فیلتر محصولات بر اساس جستجو
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
      setIsSearchOpen(false); // بستن منو وقتی جستجو خالی است
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setIsSearchOpen(true); // باز کردن منو وقتی نتایج وجود دارد
  }, [searchQuery, products]);

  return (
    <header className="bg-white shadow-md py-2 sm:py-3 px-2 sm:px-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* لوگو */}
        <Link to="/">
          <img
            src="/img/logo.png"
            alt="لوگو"
            className="w-12 sm:w-16 h-12 sm:h-16 rounded-full object-cover border"
          />
        </Link>

        {/* نوار جستجو */}
        <div className="relative flex-1 w-full sm:w-auto mx-0 sm:mx-6">
          <input
            type="text"
            placeholder="جستجو در فروشگاه چرخ خیاطی ارکیده"
            className="w-full px-2 sm:px-4 py-1 sm:py-2 border border-gray-300

 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-right text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearchOpen && filteredProducts.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 sm:max-h-60 overflow-y-auto z-10">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="p-1 sm:p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1 sm:gap-2"
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    setIsSearchOpen(false); // بستن منوی جستجو
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-6 sm:w-10 h-6 sm:h-10 object-contain"
                  />
                  <span className="text-xs sm:text-sm">{product.name}</span>
                </li>
              ))}
            </ul>
          )}
          {searchQuery.trim() !== "" && filteredProducts.length === 0 && isSearchOpen && (
            <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg p-1 sm:p-2 z-10">
              <p className="text-xs sm:text-sm">.محصول یافت نشد</p>
            </div>
          )}
        </div>

        {/* آیکون‌ها */}
        <div className="flex items-center gap-2 sm:gap-4 text-gray-600">
          <Link to="/favorites">
            <div className="relative">
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 hover:text-pink-600" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-3 sm:w-4 h-3 sm:h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>
          </Link>

          {/* دکمه ورود یا آیکون کاربر */}
          {!currentUser ? (
            <button
              onClick={handleUserClick}
              className="bg-pink-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 text-xs sm:text-sm"
              disabled={loading}
            >
              ورود/ثبت نام
            </button>
          ) : (
            <button
              onClick={handleUserClick}
              className="relative hover:text-pink-600 disabled:opacity-50"
              disabled={loading}
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover border-2 border-pink-500"
                />
              ) : (
                <User2 className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </button>
          )}

          <Link to="/cart">
            <div className="relative">
              <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 hover:text-pink-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-3 sm:w-4 h-3 sm:h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* آیکون درباره ما */}
          <Link to="/about" className="hover:text-pink-600" title="درباره ما">
            <Info className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}