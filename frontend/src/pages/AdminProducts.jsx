import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [editData, setEditData] = useState({});

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = async () => {
  //   setLoading(true);
  //   const snapshot = await getDocs(collection(db, "products"));
  //   const productsList = snapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   setProducts(productsList);
  //   setLoading(false);
  // };

  // const handleDelete = async (id) => {
  //   if (window.confirm("آیا از حذف این محصول مطمئن هستید؟")) {
  //     await deleteDoc(doc(db, "products", id));
  //     fetchProducts();
  //   }
  // };

  useEffect(() => {
  setProducts([
    { id: "1", name: "محصول نمونه 1", price: 100000, discount: 10, inventory: 50, identifier: "ID001" },
    { id: "2", name: "محصول نمونه 2", price: 200000, discount: 20, inventory: 30, identifier: "ID002" },
  ]);
  setLoading(false);
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditData(product);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleUpdate = async () => {
  //   const productRef = doc(db, "products", editProduct.id);
  //   await updateDoc(productRef, editData);
  //   setEditProduct(null);
  //   fetchProducts();
  // };

  const columns = [
    { field: "name", headerName: "نام محصول", flex: 1, align: "right" },
    { field: "category", headerName: "دسته‌بندی", flex: 1, align: "right" },
    { field: "price", headerName: "قیمت", flex: 1, align: "right", valueFormatter: ({ value }) => value?.toLocaleString() },
    { field: "discount", headerName: "تخفیف", flex: 1, align: "right", renderCell: ({ value }) => <div>{value}%</div> },
    {
      field: "finalPrice",
      headerName: "قیمت بعد تخفیف",
      flex: 1,
      align: "right",
      valueFormatter: (params) => {
        const row = params?.row || {};
        const price = Number(row.price);
        const discount = Number(row.discount);
        if (isNaN(price) || isNaN(discount)) return null;
        return Math.round(price * (1 - discount / 100));
      },
    },
    { field: "inventory", headerName: "موجودی", flex: 1, align: "right" },
    { field: "identifier", headerName: "شناسه", flex: 1.5, align: "right" },
    {
      field: "actions",
      headerName: "عملیات",
      flex: 1,
      align: "center",
      renderCell: (params) => (
        <div className="flex gap-2 items-center flex-col sm:flex-row">
          <Button
            color="error"
            onClick={() => handleDelete(params.row.id)}
            size="small"
            sx={{ width: "100%", sm: { width: "auto" } }}
          >
            <DeleteIcon sx={{ ml: 1 }} /> حذف
          </Button>
          <Button
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
            sx={{ width: "100%", sm: { width: "auto" } }}
          >
            <EditIcon sx={{ ml: 1 }} /> ویرایش
          </Button>
        </div>
      ),
    },
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer
      sx={{
        justifyContent: "space-between",
        gap: { xs: 1, sm: 2 },
        flexWrap: "wrap",
        p: { xs: 1, sm: 2 },
      }}
    >
      <GridToolbarQuickFilter
        quickFilterParser={(input) => input.split(/\s+/).filter((word) => word.length > 0)}
        placeholder="جستجو..."
        sx={{ minWidth: { xs: "100%", sm: 240 } }}
      />
    </GridToolbarContainer>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-white rounded-lg shadow-md" dir="rtl">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 text-center">
        مدیریت محصولات
      </h2>
      <div style={{ height: { xs: 400, sm: 600 }, width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          components={{ Toolbar: CustomToolbar }}
          sx={{
            direction: "rtl",
            fontFamily: "inherit",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </div>
      <Dialog
        open={!!editProduct}
        onClose={() => setEditProduct(null)}
        dir="rtl"
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { p: { xs: 1, sm: 2 } } }}
      >
        <DialogTitle>ویرایش محصول</DialogTitle>
        <DialogContent>
          <TextField
            label="نام محصول"
            value={editData.name || ""}
            onChange={(e) => handleEditChange("name", e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="دسته‌بندی"
            value={editData.category || ""}
            onChange={(e) => handleEditChange("category", e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="قیمت"
            type="number"
            value={editData.price || 0}
            onChange={(e) => handleEditChange("price", Number(e.target.value))}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="تخفیف (%)"
            type="number"
            value={editData.discount || 0}
            onChange={(e) => handleEditChange("discount", Number(e.target.value))}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="موجودی"
            type="number"
            value={editData.inventory || 0}
            onChange={(e) => handleEditChange("inventory", Number(e.target.value))}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
          <TextField
            label="شناسه"
            value={editData.identifier || ""}
            onChange={(e) => handleEditChange("identifier", e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProduct(null)}>انصراف</Button>
          <Button variant="contained" onClick={handleUpdate}>
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProducts;