import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    title: "",
    price: "",
    category: "",
    description: "",
    inventory: "",
    image: "",
    discount: 0,
    material: "",
    size: "",
    color: "",
    weight: "", // فیلد وزن اضافه شده
    additionalFeatures: {},
    suitableFor: "",
    identifier: "",
    comments: [],
    rating: [],
    dis: "",
    customId: "", // فیلد جدید برای Document ID
  });
  const [categories, setCategories] = useState([]);
  const [featureKey, setFeatureKey] = useState("");
  const [featureValue, setFeatureValue] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categoriesData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
      }));
      setCategories(categoriesData);
    }, (error) => {
      console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    });

    if (id) {
      setEditMode(true);
      const productDocRef = doc(db, "products", id);
      onSnapshot(productDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct({
            ...productData,
            price: productData.price.toString(),
            inventory: productData.inventory.toString(),
            discount: productData.discount.toString() || "0",
            weight: productData.weight || "",
            customId: id, // تنظیم customId با ID موجود برای ویرایش
          });
        }
      }, (error) => {
        console.error("خطا در دریافت محصول:", error);
      });
    }

    return () => unsubscribe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureAdd = () => {
    if (featureKey && featureValue) {
      setProduct((prev) => ({
        ...prev,
        additionalFeatures: {
          ...prev.additionalFeatures,
          [featureKey]: featureValue,
        },
      }));
      setFeatureKey("");
      setFeatureValue("");
    }
  };

  const handleFeatureRemove = (key) => {
    setProduct((prev) => {
      const newFeatures = { ...prev.additionalFeatures };
      delete newFeatures[key];
      return { ...prev, additionalFeatures: newFeatures };
    });
  };

  const handleCommentAdd = () => {
    if (newComment.trim()) {
      setProduct((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment.trim()],
      }));
      setNewComment("");
    }
  };

  const handleCommentRemove = (index) => {
    setProduct((prev) => ({
      ...prev,
      comments: prev.comments.filter((_, i) => i !== index),
    }));
  };

  const handleRatingAdd = () => {
    const ratingValue = parseInt(newRating);
    if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
      setProduct((prev) => ({
        ...prev,
        rating: [...prev.rating, ratingValue],
      }));
      setNewRating("");
    }
  };

  const handleRatingRemove = (index) => {
    setProduct((prev) => ({
      ...prev,
      rating: prev.rating.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category || !product.inventory || !product.customId) {
      alert("لطفاً تمام فیلدهای ضروری از جمله Document ID را پر کنید.");
      return;
    }
    try {
      const finalPrice = product.discount
        ? Math.round(parseInt(product.price) * (1 - parseInt(product.discount) / 100))
        : parseInt(product.price);
      if (editMode && id) {
        const productDocRef = doc(db, "products", id);
        await setDoc(productDocRef, {
          ...product,
          price: parseInt(product.price),
          inventory: parseInt(product.inventory),
          discount: parseInt(product.discount) || 0,
          weight: product.weight || "",
          finalPrice,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        alert("محصول با موفقیت ویرایش شد!");
      } else {
        const productDocRef = doc(db, "products", product.customId);
        await setDoc(productDocRef, {
          ...product,
          price: parseInt(product.price),
          inventory: parseInt(product.inventory),
          discount: parseInt(product.discount) || 0,
          weight: product.weight || "",
          finalPrice,
          createdAt: new Date().toISOString(),
        });
        alert("محصول با موفقیت اضافه شد!");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("خطا در پردازش محصول:", error);
      alert("خطا در پردازش محصول. ممکن است Document ID تکراری باشد.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-2 sm:p-4 md:p-6" dir="rtl">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
          {editMode ? "ویرایش محصول" : "اضافه کردن محصول جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <TextField
              name="name"
              label="نام محصول"
              value={product.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="title"
              label="عنوان محصول"
              value={product.title}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="price"
              label="قیمت (تومان)"
              type="number"
              value={product.price}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth required variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>دسته‌بندی</InputLabel>
              <Select
                name="category"
                value={product.category}
                onChange={handleChange}
                label="دسته‌بندی"
              >
                <MenuItem value="">انتخاب دسته‌بندی</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="inventory"
              label="موجودی"
              type="number"
              value={product.inventory}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="discount"
              label="تخفیف (%)"
              type="number"
              value={product.discount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="material"
              label="جنس"
              value={product.material}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="size"
              label="ابعاد"
              value={product.size}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="weight"
              label="وزن"
              value={product.weight}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="color"
              label="رنگ"
              value={product.color}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="suitableFor"
              label="مناسب برای"
              value={product.suitableFor}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="identifier"
              label="شناسه محصول"
              value={product.identifier}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="image"
              label="لینک تصویر"
              value={product.image}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
            <TextField
              name="customId"
              label="Document ID"
              value={product.customId}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2 }}
            />
          </div>
          <TextField
            name="description"
            label="توضیحات"
            value={product.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            InputProps={{ className: "text-right" }}
            sx={{ mb: 2 }}
          />
          <TextField
            name="dis"
            label="توضیحات اضافی"
            value={product.dis}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            InputProps={{ className: "text-right" }}
            sx={{ mb: 2 }}
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <TextField
              label="ویژگی کلیدی"
              value={featureKey}
              onChange={(e) => setFeatureKey(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2, width: "100%", sm: { width: "48%" } }}
            />
            <TextField
              label="مقدار ویژگی"
              value={featureValue}
              onChange={(e) => setFeatureValue(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2, width: "100%", sm: { width: "48%" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFeatureAdd}
              sx={{ mb: 2, width: "100%", sm: { width: "auto" } }}
            >
              افزودن ویژگی
            </Button>
          </div>
          <div className="space-y-2">
            {Object.entries(product.additionalFeatures).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-600">
                <span>{key}: {value}</span>
                <IconButton onClick={() => handleFeatureRemove(key)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <TextField
              label="کامنت جدید"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2, width: "100%", sm: { width: "70%" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentAdd}
              sx={{ mb: 2, width: "100%", sm: { width: "auto" } }}
            >
              افزودن کامنت
            </Button>
          </div>
          <div className="space-y-2">
            {product.comments.map((comment, index) => (
              <div key={index} className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-600">
                <span>{comment}</span>
                <IconButton onClick={() => handleCommentRemove(index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <TextField
              label="امتیاز جدید (0-5)"
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              fullWidth
              variant="outlined"
              inputProps={{ min: 0, max: 5 }}
              InputProps={{ className: "text-right" }}
              sx={{ mb: 2, width: "100%", sm: { width: "70%" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRatingAdd}
              sx={{ mb: 2, width: "100%", sm: { width: "auto" } }}
            >
              افزودن امتیاز
            </Button>
          </div>
          <div className="space-y-2">
            {product.rating.map((rating, index) => (
              <div key={index} className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-600">
                <span>امتیاز: {rating}</span>
                <IconButton onClick={() => handleRatingRemove(index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: "100%", sm: { width: "auto" } }}
          >
            {editMode ? "ذخیره تغییرات" : "افزودن محصول"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;