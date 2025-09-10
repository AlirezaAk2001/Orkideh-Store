// pages/auth.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const allowedAdmins = ["alireza.akhoondi1@gmail.com"];

export default function AuthPage() {
  const { login, loading, error, updateUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [tempAuth, setTempAuth] = useState(null);
  const router = useRouter();

  const persianRegex = /^[\u0600-\u06FF\s]+$/;
  const usernameRegex = /[@_]/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!persianRegex.test(value)) error = "نام باید به فارسی باشد";
        break;
      case "lastName":
        if (!persianRegex.test(value)) error = "نام خانوادگی باید به فارسی باشد";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) error = "ایمیل معتبر وارد کنید";
        break;
      case "username":
        if (!usernameRegex.test(value)) error = "نام کاربری باید شامل @ یا _ باشد";
        break;
      case "password":
        if (value.length < 8) error = "رمز عبور باید حداقل ۸ کاراکتر باشد";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "تأیید رمز عبور با رمز عبور مطابقت ندارد";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, username, password, confirmPassword } = formData;
    const newErrors = {};

    if (!isLogin) {
      if (!persianRegex.test(firstName)) newErrors.firstName = "نام باید به فارسی باشد";
      if (!persianRegex.test(lastName)) newErrors.lastName = "نام خانوادگی باید به فارسی باشد";
      if (!email) newErrors.email = "ایمیل اجباری است";
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "ایمیل معتبر وارد کنید";
      if (!username) newErrors.username = "نام کاربری اجباری است";
      else if (!usernameRegex.test(username)) newErrors.username = "نام کاربری باید شامل @ یا _ باشد";
      if (!password) newErrors.password = "رمز عبور اجباری است";
      else if (password.length < 8) newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
      if (!confirmPassword) newErrors.confirmPassword = "تأیید رمز عبور اجباری است";
      else if (confirmPassword !== password)
        newErrors.confirmPassword = "تأیید رمز عبور با رمز عبور مطابقت ندارد";
    } else {
      if (!email) newErrors.email = "ایمیل اجباری است";
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "ایمیل معتبر وارد کنید";
      if (!password) newErrors.password = "رمز عبور اجباری است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        const resp = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "Login failed");

        login(data.user, data.token);
        Swal.fire("ورود موفق", "خوش آمدید!", "success");

        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        const resp = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "Signup failed");

        setTempAuth({ uid: data.uid, role: allowedAdmins.includes(formData.email) ? "admin" : "user" });
        setIsVerifying(true);
        router.push("/verify");
      }
    } catch (error) {
      Swal.fire("خطا", error.message || "عملیات شکست خورد", "error");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const { uid, role } = tempAuth || {};

    if (!uid) return Swal.fire("خطا", "اطلاعات یافت نشد", "error");

    try {
      const resp = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: uid, code: verificationCode }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Verify failed");

      setIsVerifying(false);
      updateUser({ verified: true });
      Swal.fire("موفق", "ایمیل شما تأیید شد", "success");

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setCodeError(error.message || "خطای تأیید");
      Swal.fire("خطا", error.message || "خطای تأیید", "error");
    }
  };

  useEffect(() => {
    if (!loading && !isVerifying && router.pathname !== "/verify" && router.pathname !== "/auth") {
      router.push("/auth");
    }
  }, [router, isVerifying, loading]);

  return (
    <div
      className="h-screen flex items-center justify-center bg-gray-50 bg-no-repeat bg-center bg-contain overflow-hidden"
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
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-opacity-90">
        <AnimatePresence mode="wait">
          {!isVerifying ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -50 : 50 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-center">
                {isLogin ? "ورود" : "ثبت‌نام"}
              </h2>
              {error && <p className="text-red-500 text-center mb-2">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4" dir="rtl">
                {!isLogin && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="نام"
                        className="w-full p-2 sm:p-3 md:p-4 border rounded"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="نام خانوادگی"
                        className="w-full p-2 sm:p-3 md:p-4 border rounded"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </>
                )}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="ایمیل"
                    className="w-full p-2 sm:p-3 md:p-4 border rounded"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.email}</p>
                  )}
                </div>
                {!isLogin && (
                  <div>
                    <input
                      type="text"
                      name="username"
                      placeholder="نام کاربری"
                      className="w-full p-2 sm:p-3 md:p-4 border rounded"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.username}</p>
                    )}
                  </div>
                )}
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="رمز عبور"
                    className="w-full p-2 sm:p-3 md:p-4 border rounded"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.password}</p>
                  )}
                </div>
                {!isLogin && (
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="تأیید رمز عبور"
                      className="w-full p-2 sm:p-3 md:p-4 border rounded"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded hover:bg-blue-700 text-sm sm:text-base md:text-lg"
                  disabled={loading}
                >
                  {isLogin ? "ورود" : "ثبت‌نام"}
                </button>
              </form>
              <p className="mt-2 sm:mt-3 md:mt-4 text-center text-xs sm:text-sm md:text-base">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600"
                >
                  {isLogin ? "ثبت‌نام" : "ورود"}
                </button>{" "}
                {isLogin ? "حساب کاربری ندارید؟" : "قبلا ثبت‌نام کرده‌اید؟"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
            >
              <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-opacity-90">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-center">تأیید ایمیل</h2>
                <form onSubmit={handleVerifyCode} className="space-y-2 sm:space-y-3 md:space-y-4" dir="rtl">
                  <p className="text-center text-gray-600 mb-2 sm:mb-4 text-xs sm:text-sm md:text-base">
                    کد تأیید به ایمیل {tempAuth?.uid || formData.email} ارسال شده است. لطفاً آن را بررسی کنید.
                  </p>
                  <input
                    type="text"
                    placeholder="کد تأیید"
                    className="w-full p-2 sm:p-3 md:p-4 border rounded"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  {codeError && <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">{codeError}</p>}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded hover:bg-blue-700 text-sm sm:text-base md:text-lg"
                    disabled={loading}
                  >
                    تأیید
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}