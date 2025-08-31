import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const categoriesData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setCategories(categoriesData);
        setError(null);
        console.log("دسته‌بندی‌ها با موفقیت لود شدند:", categoriesData);
      },
      (err) => {
        console.error("خطا در دریافت دسته‌بندی‌ها:", err);
        setError(`خطا در دریافت دسته‌بندی‌ها: ${err.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError(".نام دسته‌بندی را وارد کنید");
      return;
    }
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        createdAt: new Date().toISOString(),
      });
      setNewCategory("");
      setError(null);
      console.log(".دسته‌بندی جدید اضافه شد");
    } catch (err) {
      console.error("خطا در افزودن دسته‌بندی:", err);
      setError(`خطا در افزودن دسته‌بندی: ${err.message}`);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setOpenDialog(true);
  };

  const handleUpdateCategory = async () => {
    if (!editCategory?.name?.trim()) {
      setError(".نام دسته‌بندی را وارد کنید");
      return;
    }
    try {
      await updateDoc(doc(db, "categories", editCategory.id), {
        name: editCategory.name.trim(),
      });
      setOpenDialog(false);
      setEditCategory(null);
      setError(null);
      console.log(".دسته‌بندی به‌روزرسانی شد");
    } catch (err) {
      console.error("خطا در به‌روزرسانی دسته‌بندی:", err);
      setError(`خطا در به‌روزرسانی دسته‌بندی: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟")) {
      try {
        await deleteDoc(doc(db, "categories", id));
        setError(null);
        console.log(".دسته‌بندی حذف شد");
      } catch (err) {
        console.error("خطا در حذف دسته‌بندی:", err);
        setError(`خطا در حذف دسته‌بندی: ${err.message}`);
      }
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-white rounded-lg shadow-md" dir="rtl">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 text-center">
        مدیریت دسته‌بندی‌ها
      </h2>
      {error && <p className="text-red-500 mb-2 sm:mb-4 text-sm sm:text-base">{error}</p>}
      <div className="mb-2 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <TextField
          label="نام دسته‌بندی جدید"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
          error={!!error && !newCategory.trim()}
          helperText={error && !newCategory.trim() ? error : ""}
          variant="outlined"
          sx={{ mb: { xs: 2, sm: 0 } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{ width: "100%", sm: { width: "auto" } }}
        >
          افزودن
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">نام</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} sx={{ display: { xs: "block", sm: "table-row" } }}>
                <TableCell
                  align="right"
                  sx={{
                    display: "block",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  {category.name}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    display: "block",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                    "&:last-child": { borderBottom: "none" },
                    justifyContent: "center",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEditCategory(category)}
                    sx={{ mr: 1, mb: { xs: 1, sm: 0 }, width: "100%", sm: { width: "auto" } }}
                  >
                    ویرایش
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteCategory(category.id)}
                    sx={{ width: "100%", sm: { width: "auto" } }}
                  >
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { p: { xs: 1, sm: 2 } } }}
      >
        <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="نام دسته‌بندی"
            value={editCategory?.name || ""}
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
            fullWidth
            error={!!error && !editCategory?.name?.trim()}
            helperText={error && !editCategory?.name?.trim() ? error : ""}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            لغو
          </Button>
          <Button onClick={handleUpdateCategory} color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCategories;