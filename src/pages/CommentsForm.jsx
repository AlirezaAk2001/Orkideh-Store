import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CommentsForm = ({ onSubmit, productId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "هشدار",
        text: "!برای ثبت نظر ابتدا باید ثبت نام/ورود کنید",
        confirmButtonText: "باشه",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/login");
      });
      return;
    }
    if (rating === 0 || !text.trim()) {
      Swal.fire({
        icon: "warning",
        title: "خطا",
        text: "لطفاً امتیاز و متن نظر را وارد کنید.",
        confirmButtonText: "باشه",
      });
      return;
    }
    onSubmit({
      user: currentUser.displayName || "کاربر ناشناس",
      userId: currentUser.uid,
      rating,
      text,
      approved: false,
      timestamp: new Date().toISOString(),
      productId,
    });
    setText("");
    setRating(0);
    setShowEmojiPicker(false);
    Swal.fire({
      icon: "success",
      title: "ممنونیم از نظر شما 🙏",
      text: "نظر شما پس از تأیید توسط مدیر سایت، نمایش داده خواهد شد. تیم پشتیبانی فروشگاه چرخ خیاطی ارکیده",
      confirmButtonText: "باشه",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-2 sm:space-y-4">
      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">ثبت نظر شما</h3>
      <StarRating rating={rating} setRating={setRating} />
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          className="w-full border rounded-lg p-2 sm:p-3 h-24 sm:h-32 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-xl sm:text-2xl hover:scale-110 transition"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div
            className="absolute bottom-[120%] left-0 z-20 animate-fade-in bg-white dark:bg-gray-800 shadow-xl border rounded-2xl p-2 w-64 sm:w-72 max-h-[300px] overflow-y-scroll transition-all duration-300"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="light"
              searchDisabled
              skinTonesDisabled
              lazyLoadEmojis
              height={300}
              width="100%"
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="mt-1 sm:mt-2 bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition shadow-md text-sm sm:text-base"
      >
        ثبت نظر
      </button>
    </form>
  );
};

export default CommentsForm;