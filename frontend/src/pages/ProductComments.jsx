import React, { useState, useEffect } from "react";
import CommentsForm from "./CommentsForm";
import CommentsItem from "./CommentsItem";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProductComments = ({ productId, onCommentSubmitted }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          const allComments = (productData.comments || []).map((comment) => ({
            ...comment,
            productId,
          }));
          const approvedComments = allComments.filter(
            (comment) => comment.approved === true
          );
          setComments(approvedComments);
        }
      } catch (err) {
        console.error("خطا در دریافت نظرات:", err);
      }
    };
    fetchComments();
  }, [productId]);

  const handleCommentSubmit = async (newComment) => {
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

    try {
      const commentsRef = collection(db, "products", productId, "comments");
      await addDoc(commentsRef, {
        ...newComment,
        timestamp: new Date().toISOString(),
      });
      if (onCommentSubmitted) onCommentSubmitted();
    } catch (err) {
      console.error("خطا در ثبت نظر:", err);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "خطا در ثبت نظر. لطفاً دوباره تلاش کنید.",
        confirmButtonText: "باشه",
      });
    }
  };

  return (
    <div className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
      <CommentsForm onSubmit={handleCommentSubmit} productId={productId} />
      <h2 className="text-lg sm:text-xl font-bold">نظرات کاربران:</h2>
      {comments.length === 0 ? (
        <p className="text-sm sm:text-base">هنوز نظری ثبت نشده است.</p>
      ) : (
        comments.map((comment, index) => (
          <CommentsItem
            key={comment.timestamp + "_" + index}
            comment={comment}
          />
        ))
      )}
    </div>
  );
};

export default ProductComments;