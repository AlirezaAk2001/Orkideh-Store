import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, role } = location.state || {};

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (!userEmail) {
      Swal.fire("خطا", "ایمیل کاربر یافت نشد. لطفاً دوباره ثبت‌نام کنید.", "error");
      navigate("/auth", { replace: true });
      return;
    }
    if (verificationCode === "1234") { // کد نمونه برای تست
      Swal.fire("موفق", "ایمیل شما با موفقیت تأیید شد!", "success");
      setCodeError("");
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      setCodeError("کد تأیید اشتباه است.");
      Swal.fire("خطا", "کد تأیید اشتباه است.", "error");
    }
  };

  const updateUser = () => {};

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-50 bg-no-repeat bg-center bg-contain"
        style={{
          backgroundImage: "url('/img/logo.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundColor: "#f5f5f5",
          height: "100vh",
          margin: 0,
          padding: 0,
          position: "fixed",
          top: "38px",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-opacity-90">
          <AnimatePresence mode="wait">
            <motion.div
              key="verify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-center">
                تأیید ایمیل
              </h2>
              <form onSubmit={handleVerifyCode} className="space-y-2 sm:space-y-3 md:space-y-4" dir="rtl">
                <p className="text-center text-gray-600 mb-2 sm:mb-4 text-xs sm:text-sm md:text-base">
                  کد تأیید به ایمیل{" "}
                  <strong>{userEmail || "نامشخص"}</strong> ارسال شده است. لطفاً آن را وارد کنید.
                </p>
                <input
                  type="text"
                  placeholder="کد تأیید"
                  className="w-full p-2 sm:p-3 md:p-4 border rounded text-sm sm:text-base"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                {codeError && (
                  <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">
                    {codeError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded hover:bg-blue-700 text-sm sm:text-base md:text-lg"
                >
                  تأیید
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default VerifyPage;