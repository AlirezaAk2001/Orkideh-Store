import React, { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";

const AdminCommentsTable = ({ comments, fetchAgain, onApprove, onDelete }) => {
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [productFilter, setProductFilter] = useState("");
  const [quickSearch, setQuickSearch] = useState("");

  // تابع‌های کامنت‌شده را می‌توان به‌صورت دمو نگه داشت
  const handleDelete = async () => {
    if (!deleteInfo) return;
    await onDelete(deleteInfo.id);
    setDeleteInfo(null);
    toast.success("نظر با موفقیت حذف شد");
  };

  const handleApprove = async (commentId) => {
    await onApprove(commentId);
  };

  const allProducts = useMemo(() => {
    const map = new Map();
    comments.forEach((c) => {
      if (!map.has(c.productId)) map.set(c.productId, c.productName || "");
    });
    return Array.from(map.entries());
  }, [comments]);

  const rows = useMemo(() => {
    return comments
      .filter((comment) => (productFilter ? comment.productId === productFilter : true))
      .filter((comment) =>
        quickSearch
          ? comment.text?.toLowerCase().includes(quickSearch.toLowerCase()) ||
            comment.user?.toLowerCase().includes(quickSearch.toLowerCase())
          : true
      )
      .map((comment, i) => ({
        id: comment.id,
        productId: comment.productId,
        productName: comment.productName || "",
        user: comment.user || "نامشخص",
        rating: comment.rating || 0,
        text: comment.text || "",
        timestamp: new Date(comment.timestamp).toLocaleDateString("fa-IR"),
        timestampRaw: comment.timestamp || 0,
        index: i,
        approved: comment.approved || false,
      }));
  }, [comments, productFilter, quickSearch]);

  const columns = [
    { field: "user", headerName: "نام کاربر", flex: 1, align: "right" },
    { field: "rating", headerName: "امتیاز", width: 90, editable: true, align: "right" },
    { field: "text", headerName: "متن نظر", flex: 2, editable: true, align: "right" },
    {
      field: "timestamp",
      headerName: "تاریخ",
      width: 130,
      align: "right",
      sortComparator: (v1, v2, cell1, cell2) => cell1.row.timestampRaw - cell2.row.timestampRaw,
    },
    { field: "productId", headerName: "نام محصول", flex: 1, align: "right" },
    {
      field: "approved",
      headerName: "وضعیت",
      width: 100,
      align: "right",
      renderCell: (params) => (params.row.approved ? "تأیید شده" : "در انتظار"),
    },
    {
      field: "approve",
      headerName: "تأیید",
      width: 100,
      align: "center",
      renderCell: (params) =>
        !params.row.approved && (
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleApprove(params.row.id)}
          >
            <CheckIcon fontSize="small" />
          </Button>
        ),
    },
    {
      field: "actions",
      headerName: "حذف",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => setDeleteInfo(params.row)}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  const CustomToolbar = () => (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 2 },
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TextField
        placeholder="جستجوی سریع..."
        value={quickSearch}
        onChange={(e) => setQuickSearch(e.target.value)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: { xs: "100%", sm: 240 } }}
      />
      <TextField
        select
        label="فیلتر محصول"
        size="small"
        value={productFilter}
        onChange={(e) => setProductFilter(e.target.value)}
        sx={{ minWidth: { xs: "100%", sm: 200 } }}
      >
        <MenuItem value="">همه محصولات</MenuItem>
        {allProducts.map(([id, name]) => (
          <MenuItem key={id} value={id}>
            {name || id}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );

  return (
    <>
      <div style={{ height: { xs: 400, sm: 600 }, width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          processRowUpdate={async (updatedRow) => {
            // کد مربوط به Firestore کامنت شده است
            fetchAgain();
            toast.success(".ویرایش انجام شد");
            return updatedRow;
          }}
          slots={{ toolbar: CustomToolbar }}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            fontFamily: "inherit",
            direction: "rtl",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </div>

      <Dialog open={!!deleteInfo} onClose={() => setDeleteInfo(null)} dir="rtl">
        <DialogTitle>آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteInfo(null)}>انصراف</Button>
          <Button color="error" onClick={handleDelete}>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminCommentsTable;