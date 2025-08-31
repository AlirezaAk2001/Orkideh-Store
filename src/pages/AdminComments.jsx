import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AdminCommentsTable from "./AdminCommentsTable";
import Swal from "sweetalert2";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllComments = async () => {
    setLoading(true);
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const allComments = [];

      for (const docSnap of productsSnapshot.docs) {
        const productId = docSnap.id;
        const productData = docSnap.data();
        const commentsRef = collection(db, "products", productId, "comments");
        const commentsSnapshot = await getDocs(commentsRef);
        commentsSnapshot.forEach((commentDoc) => {
          const commentData = commentDoc.data();
          allComments.push({
            id: commentDoc.id,
            productId,
            productName: productData.name || "نامشخص",
            user: commentData.user || "نامشخص",
            rating: commentData.rating || 0,
            text: commentData.text || "",
            timestamp: commentData.timestamp || null,
            approved: commentData.approved || false,
          });
        });
      }

      setComments(allComments);
    } catch (err) {
      console.error("خطا در گرفتن نظرات:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) {
        console.warn(".کامنت یافت نشد");
        return;
      }

      const commentRef = doc(db, "products", comment.productId, "comments", commentId);
      const commentSnap = await getDoc(commentRef);
      if (!commentSnap.exists()) {
        console.warn(".کامنت یافت نشد");
        return;
      }

      await updateDoc(commentRef, { approved: true });
      Swal.fire({
        icon: "success",
        title: "موفقیت",
        text: ".نظر با موفقیت تأیید شد",
        confirmButtonText: "باشه",
      });
      fetchAllComments();
    } catch (err) {
      console.error("خطا در تأیید نظر:", err);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: ".خطا در تأیید نظر",
        confirmButtonText: "باشه",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) {
        console.warn(".کامنت یافت نشد");
        return;
      }

      const commentRef = doc(db, "products", comment.productId, "comments", commentId);
      const commentSnap = await getDoc(commentRef);
      if (!commentSnap.exists()) {
        console.warn(".کامنت یافت نشد");
        return;
      }

      await deleteDoc(commentRef);
      Swal.fire({
        icon: "success",
        title: "موفقیت",
        text: ".نظر با موفقیت حذف شد",
        confirmButtonText: "باشه",
      });
      fetchAllComments();
    } catch (err) {
      console.error("خطا در حذف نظر:", err);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: ".خطا در حذف نظر",
        confirmButtonText: "باشه",
      });
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-white rounded-lg shadow-md" dir="rtl">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 text-center">
        مدیریت نظرات کاربران
      </h2>
      {loading ? (
        <p className="text-center text-gray-600">در حال بارگذاری...</p>
      ) : (
        <AdminCommentsTable
          comments={comments}
          fetchAgain={fetchAllComments}
          onApprove={handleApproveComment}
          onDelete={handleDeleteComment}
        />
      )}
    </div>
  );
};

export default AdminComments;