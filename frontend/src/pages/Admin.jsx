import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import CommentIcon from "@mui/icons-material/Comment";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// 📌 لیست ایمیل‌های مجاز برای ادمین
const allowedAdmins = ["alireza.akhoondi1@gmail.com"];

const adminSections = [
  {
    title: "مدیریت محصولات",
    description: "افزودن، ویرایش یا حذف محصولات فروشگاه",
    icon: <InventoryIcon sx={{ fontSize: 50, color: "primary.main" }} />,
    link: "/admin/products",
    btnColor: "primary",
  },
  {
    title: "مدیریت نظرات کاربران",
    description: "مشاهده و مدیریت نظرات ثبت شده توسط کاربران",
    icon: <CommentIcon sx={{ fontSize: 50, color: "secondary.main" }} />,
    link: "/admin/comments",
    btnColor: "secondary",
  },
  {
    title: "مدیریت دسته‌بندی‌ها",
    description: "ایجاد یا ویرایش دسته‌بندی‌های محصولات",
    icon: <CategoryIcon sx={{ fontSize: 50, color: "success.main" }} />,
    link: "/admin/categories",
    btnColor: "success",
  },
  {
    title: "مدیریت سفارش‌ها",
    description: "نمایش و تغییر وضعیت سفارش‌های کاربران",
    icon: <LocalShippingIcon sx={{ fontSize: 50, color: "warning.main" }} />,
    link: "/admin/orders",
    btnColor: "warning",
  },
  {
    title: "افزودن محصول",
    description: "ایجاد محصول جدید به فروشگاه",
    icon: <AddCircleIcon sx={{ fontSize: 50, color: "info.main" }} />,
    link: "/admin/add-product",
    btnColor: "info",
  },
];

const Admin = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       if (allowedAdmins.includes(user.email)) {
  //         setAdminName(user.displayName || user.email || "ادمین");
  //       } else {
  //         navigate("/");
  //       }
  //     } else {
  //       navigate("/login");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [auth, navigate]);

  useEffect(() => {
  setAdminName("ادمین نمونه");
  }, []);

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("خطا در خروج:", error);
  //   }
  // };

  const handleLogout = () => {
  alert("این فقط تست UI است. خروج انجام نمی‌شود!");
  navigate("/login");
  };

  return (
    <Box sx={{ direction: "rtl", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      {/* هدر */}
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: 1, sm: 2 }, // Padding ریسپانسیو
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <AccountCircleIcon fontSize="large" />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} // اندازه فونت ریسپانسیو
            >
              {adminName} خوش آمدید
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleLogout} edge="end">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* محتوا */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }} // اندازه عنوان ریسپانسیو
        >
          پنل مدیریت
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {adminSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  p: { xs: 1, sm: 2 },
                  boxShadow: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                  height: "100%", // برای یکسان‌سازی ارتفاع کارت‌ها
                }}
              >
                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                  {React.cloneElement(section.icon, {
                    sx: { fontSize: { xs: 30, sm: 40, md: 50 }, color: section.icon.props.sx.color },
                  })}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mt={1}
                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" } }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
                  >
                    {section.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", p: { xs: 1, sm: 2 } }}>
                  <Button
                    variant="contained"
                    color={section.btnColor}
                    component={Link}
                    to={section.link}
                    sx={{
                      borderRadius: 2,
                      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                      px: { xs: 1, sm: 2 }, // Padding افقی دکمه
                    }}
                  >
                    ورود
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Admin;