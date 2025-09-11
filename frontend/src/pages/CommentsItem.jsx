import React from "react";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const CommentsItem = ({ comment }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  // const handleDelete = async () => {
  //   Swal.fire({
  //     title: "آیا مطمئن هستید؟",
  //     text: "این نظر حذف خواهد شد!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "بله، حذف کن!",
  //     cancelButtonText: "لغو",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         if (!comment.productId) {
  //           console.error("productId برای نظر نامعتبر است:", comment);
  //           Swal.fire({
  //             icon: "error",
  //             title: "خطا",
  //             text: "داده‌های نظر ناقص است.",
  //             confirmButtonText: "باشه",
  //           });
  //           return;
  //         }

  //         if (comment.id) {
  //           const commentRef = doc(db, "products", comment.productId, "comments", comment.id);
  //           const commentSnap = await getDoc(commentRef);
  //           if (!commentSnap.exists()) {
  //             console.warn("کامنت یافت نشد");
  //             Swal.fire({
  //               icon: "warning",
  //               title: "هشدار",
  //               text: "این نظر دیگر وجود ندارد.",
  //               confirmButtonText: "باشه",
  //             });
  //             return;
  //           }
  //           await deleteDoc(commentRef);
  //         } else {
  //           const productRef = doc(db, "products", comment.productId);
  //           const productSnap = await getDoc(productRef);
  //           if (productSnap.exists()) {
  //             const productData = productSnap.data();
  //             const commentsArr = productData.comments || [];
  //             const index = commentsArr.findIndex(
  //               (c) => c.user === comment.user && c.text === comment.text
  //             );
  //             if (index !== -1) {
  //               commentsArr.splice(index, 1);
  //               await updateDoc(productRef, { comments: commentsArr });
  //             } else {
  //               console.warn("کامنت تستی یافت نشد");
  //               Swal.fire({
  //                 icon: "warning",
  //                 title: "هشدار",
  //                 text: "این نظر تستی دیگر وجود ندارد.",
  //                 confirmButtonText: "باشه",
  //               });
  //               return;
  //             }
  //           }
  //         }

  //         Swal.fire({
  //           icon: "success",
  //           title: "موفقیت",
  //           text: "نظر با موفقیت حذف شد.",
  //           confirmButtonText: "باشه",
  //         });
  //       } catch (err) {
  //         console.error("خطا در حذف نظر:", err);
  //         Swal.fire({
  //           icon: "error",
  //           title: "خطا",
  //           text: "خطا در حذف نظر.",
  //           confirmButtonText: "باشه",
  //         });
  //       }
  //     }
  //   });
  // };

  return (
    <div className="border rounded-lg p-2 sm:p-3 md:p-4 mb-2 sm:mb-3">
      <div className="flex justify-between items-center">
        <div>
          <strong className="text-sm sm:text-base md:text-lg">{comment.user}</strong>
          <div className="mt-1 sm:mt-2">
            <StarRating rating={comment.rating} />
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-xs sm:text-sm md:text-base"
          >
            حذف
          </button>
        )}
      </div>
      <p className="mt-1 sm:mt-2 whitespace-pre-line text-gray-700 text-sm sm:text-base md:text-lg">
        {comment.text}
      </p>
      <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1 sm:mt-2">
        {new Date(comment.timestamp).toLocaleDateString("fa-IR")}
      </p>
    </div>
  );
};

export default CommentsItem;