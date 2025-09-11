import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Package, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fileInputRef = useRef(null); // تعریف fileInputRef
  const unsubscribeOrdersRef = useRef(null);

  const getAvatarColor = (char) => {
    const palette = [
      "bg-red-200 text-red-700",
      "bg-orange-200 text-orange-700",
      "bg-amber-200 text-amber-700",
      "bg-yellow-200 text-yellow-700",
      "bg-lime-200 text-lime-700",
      "bg-green-200 text-green-700",
      "bg-emerald-200 text-emerald-700",
      "bg-teal-200 text-teal-700",
      "bg-cyan-200 text-cyan-700",
      "bg-sky-200 text-sky-700",
      "bg-blue-200 text-blue-700",
      "bg-indigo-200 text-indigo-700",
      "bg-violet-200 text-violet-700",
      "bg-purple-200 text-purple-700",
      "bg-fuchsia-200 text-fuchsia-700",
      "bg-pink-200 text-pink-700",
      "bg-rose-200 text-rose-700",
      "bg-stone-200 text-stone-700",
    ];
    const code = char && char.length > 0 ? char.charCodeAt(0) : 0;
    const idx = Math.abs(code) % palette.length;
    return palette[idx];
  };

  // const handleLogout = async () => {
  //   setIsLoggingOut(true);
  //   try {
  //     await signOut(auth);
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 100);
  //   } catch (error) {
  //     console.error("خطا در خروج از حساب:", error);
  //     alert("خطا در خروج از حساب. لطفاً دوباره تلاش کنید.");
  //   } finally {
  //     setIsLoggingOut(false);
  //   }
  // };

  const handleLogout = () => {
  alert("این فقط تست UI است. خروج انجام نمی‌شود!");
  navigate("/");
  };

  const handleImageUpload = (uploadedUrl) => {
    if (uploadedUrl) {
      setProfileImage(uploadedUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      updateProfileImage(uploadedUrl);
    }
  };

  // const updateProfileImage = async (url) => {
  //   try {
  //     await updateDoc(doc(db, "users", user.uid), { profileImageUrl: url });
  //     console.log("تصویر پروفایل در Firestore به‌روزرسانی شد:", url);
  //   } catch (err) {
  //     console.error("خطا در به‌روزرسانی تصویر پروفایل:", err);
  //     setError("خطا در ذخیره تصویر در پروفایل.");
  //   }
  // };

  const updateProfileImage = () => {};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "my_unsigned");

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.cloudinary.com/v1_1/dqxkp4ur2/image/upload");

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded * 100) / e.total));
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          handleImageUpload(res.secure_url);
        } else {
          setError(`آپلود ناموفق بود! وضعیت: ${xhr.status}, ${xhr.responseText}`);
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        setError("خطای شبکه");
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (err) {
      setError("خطای غیرمنتظره");
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  // const handleDeleteImage = async () => {
  //   try {
  //     setIsUploading(true);
  //     await updateDoc(doc(db, "users", user.uid), { profileImageUrl: "" });
  //     setProfileImage(null);
  //     setPreviewUrl(null);
  //   } catch (error) {
  //     console.error("خطا در حذف عکس:", error);
  //     alert("خطا در حذف عکس.");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleDeleteImage = () => {
  setProfileImage(null);
  setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // useEffect(() => {
  //   if (!user) {
  //     setLoadingData(false);
  //     setUserData(null);
  //     setOrders([]);
  //     setAddresses([]);
  //     setProfileImage(null);
  //     if (unsubscribeOrdersRef.current) {
  //       unsubscribeOrdersRef.current();
  //     }
  //     return;
  //   }

  //   const fetchData = async () => {
  //     setLoadingData(true);
  //     try {
  //       const userSnap = await getDoc(doc(db, "users", user.uid));
  //       if (userSnap.exists()) {
  //         const userData = userSnap.data();
  //         setUserData(userData);
  //         setProfileImage(userData.profileImageUrl || null);
  //       }

  //       const addressesQuery = query(collection(db, "addresses"), where("uid", "==", user.uid));
  //       const addressesSnapshot = await getDocs(addressesQuery);
  //       const addressesData = addressesSnapshot.docs.map((docSnap) => ({
  //         id: docSnap.id,
  //         ...docSnap.data(),
  //       }));
  //       setAddresses(addressesData);
  //     } catch (error) {
  //       console.error("خطا در دریافت داده‌ها:", error);
  //     } finally {
  //       setLoadingData(false);
  //     }
  //   };

  //   fetchData();

  //   const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
  //   unsubscribeOrdersRef.current = onSnapshot(ordersQuery, (snapshot) => {
  //     const ordersData = snapshot.docs.map((docSnap) => {
  //       const data = docSnap.data();
  //       let products = Array.isArray(data.products) ? data.products : [];
  //       const parsedProducts = [];
  //       let currentProduct = {};

  //       products.forEach((str) => {
  //         const trimmed = String(str).trim().replace(/["']/g, "");
  //         const [key, value] = trimmed.split(":").map((s) => s.trim());

  //         if (key === "name") {
  //           currentProduct.name = value;
  //         } else if (key === "price") {
  //           const n = parseInt(value, 10);
  //           currentProduct.price = Number.isFinite(n) ? n : 0;
  //         } else if (key === "quantity") {
  //           const q = parseInt(value, 10);
  //           currentProduct.quantity = Number.isFinite(q) ? q : 0;
  //           if (currentProduct.name) parsedProducts.push(currentProduct);
  //           currentProduct = {};
  //         } else if (key === "imageUrl") {
  //           currentProduct.imageUrl = value;
  //         }
  //       });

  //       return { id: docSnap.id, ...data, products: parsedProducts };
  //     });
  //     setOrders(ordersData);
  //   }, (error) => {
  //     console.error("خطا در گوش دادن به سفارش‌ها:", error);
  //   });

  //   return () => {
  //     if (unsubscribeOrdersRef.current) {
  //       unsubscribeOrdersRef.current();
  //     }
  //   };
  // }, [user]);

  useEffect(() => {
  setUserData({ username: "کاربر نمونه", profileImageUrl: "/img/default-profile.jpg" });
  setOrders([
    { id: "1", userId: "testUser", products: [{ name: "محصول 1", quantity: 2 }], status: "processing", createdAt: new Date() },
  ]);
  setAddresses([{ id: "1", address: "تهران، خیابان نمونه" }]);
  setProfileImage("/img/default-profile.jpg");
  setLoadingData(false);
  }, []);

  const { deliveredCount, returnedCount, processingCount } = useMemo(() => {
    let delivered = 0,
      returned = 0,
      processing = 0;

    orders.forEach((o) => {
      const status = (o.status || "").toLowerCase().trim();
      if (status === "delivered" || status === "completed") delivered++;
      else if (status === "returned") returned++;
      else if (status === "processing") processing++;
    });

    return {
      deliveredCount: delivered,
      returnedCount: returned,
      processingCount: processing,
    };
  }, [orders]);

  const formatCreatedAt = (val) => {
    if (!val) return null;
    try {
      let d = null;
      if (typeof val?.toDate === "function") d = val.toDate();
      else if (typeof val === "number") d = new Date(val);
      else if (typeof val === "string") {
        const n = Number(val);
        d = Number.isFinite(n) ? new Date(n) : new Date(val);
      } else if (val?.seconds) d = new Date(val.seconds * 1000);
      if (!d || isNaN(d.getTime())) return null;
      return d.toLocaleDateString("fa-IR");
    } catch {
      return null;
    }
  };

  // const updateOrderStatus = useCallback(
  //   async (orderId, newStatus) => {
  //     try {
  //       const orderRef = doc(db, "orders", orderId);
  //       await updateDoc(orderRef, { status: newStatus });
  //       alert("وضعیت سفارش با موفقیت به‌روزرسانی شد.");
  //     } catch (error) {
  //       console.error("خطا در به‌روزرسانی وضعیت سفارش:", error);
  //       alert("خطا در به‌روزرسانی وضعیت سفارش.");
  //     }
  //   },
  //   []
  // );

  const updateOrderStatus = () => {};

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">...در حال بارگذاری</p>
      </div>
    );
  }

  const firstChar = user?.displayName ? user.displayName.trim().charAt(0) : "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8" dir="rtl">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-6">
        <div className="relative flex flex-col items-center">
          <div className="relative mb-4 sm:mb-6">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-500"
              />
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-500"
              />
            ) : (
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-pink-500 flex items-center justify-center text-3xl sm:text-4xl font-bold cursor-pointer hover:opacity-80 ${getAvatarColor(firstChar)}`}
                aria-label="آواتار حرف اول"
                title={firstChar || "کاربر"}
              >
                {firstChar || "؟"}
              </div>
            )}
            {!profileImage && !previewUrl && (
              <div
                className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-opacity-80 transition"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
            {previewUrl && (
              <>
                {isUploading && (
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={uploadFile}
                    disabled={isUploading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base transition"
                  >
                    آپلود
                  </button>
                  <button
                    onClick={cancelUpload}
                    disabled={isUploading}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm sm:text-base transition"
                  >
                    لغو
                  </button>
                </div>
              </>
            )}
            {profileImage && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleDeleteImage}
                  disabled={isUploading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm sm:text-base transition"
                >
                  حذف عکس
                </button>
                <label
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base transition"
                  disabled={isUploading}
                >
                  تغییر عکس
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{user.displayName || "کاربر"}</h2>
          <p className="text-gray-500 text-sm sm:text-base">{userData?.username || "نام کاربری ثبت نشده"}</p>
          <p className="text-gray-500 text-sm sm:text-base">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
        >
          <LogOut className="w-5 h-5" /> {isLoggingOut ? "در حال خروج..." : "خروج از حساب"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">سفارش‌های من</h3>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="text-blue-600 hover:underline text-sm sm:text-base"
          >
            مشاهده همه
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {["returned", "delivered", "processing"].map((status) => {
            const count =
              status === "returned"
                ? returnedCount
                : status === "delivered"
                ? deliveredCount
                : processingCount;
            return (
              <div key={status} className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-pink-100 flex items-center justify-center mb-2 sm:mb-3"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  >
                    <path
                      d={
                        status === "returned"
                          ? "M3 3v18h18V3H3zm4 10h6m-3-3l3 3-3 3"
                          : status === "delivered"
                          ? "M9 12l2 2 4-4M4 6h16M4 6v12h16V6"
                          : "M4 12h16m0 0l-4 4m4-4l-4-4"
                      }
                    />
                  </svg>
                </div>
                <p className="font-bold text-lg sm:text-xl">{count.toLocaleString("fa-IR")}</p>
                <p className="text-sm sm:text-base text-gray-500">
                  {status === "returned"
                    ? "مرجوع شده"
                    : status === "delivered"
                    ? "تحویل داده شده"
                    : "جاری"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}