import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Suspense } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails.jsx";
import Header from "./pages/Header";
import Category from "./pages/Category";
import AdminProducts from "./pages/AdminProducts";
import AdminComments from "./pages/AdminComments";
import Admin from "./pages/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";
import AdminCategories from "./pages/AdminCategories";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoritesProvider } from "./context/FavoritesContext";
import OrderManagement from "./pages/OrderManagement";
import OrdersPage from "./pages/OrdersPage";
import AdminAddProducts from "./pages/AdminAddProducts";
import AboutUs from "./pages/AboutUs";
import Footer from "./pages/Footer";

// کامپوننت لودینگ
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}
  >
    <img
      src="/img/logo.png"
      alt="Loading..."
      style={{
        width: "100px",
        height: "100px",
        animation: "spin 2s linear infinite",
      }}
    />
    <p style={{ marginTop: "20px", fontSize: "18px" }}>...در حال بارگذاری</p>
  </div>
);

function App() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  const AdminRoute = ({ children }) => {
    const isAdmin = currentUser && allowedAdmins.includes(currentUser.email);
    if (loading) return <LoadingSpinner />;
    return isAdmin ? children : <Navigate to="/login" />;
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) return <LoadingSpinner />;
    if (!currentUser || (currentUser && !currentUser.emailVerified)) {
      if (location.pathname !== "/login" && location.pathname !== "/verify") {
        window.location.href = "http://localhost:3000/login"; // ریدایرکت به Next.js
        return null;
      }
      return null;
    }
    return children;
  };

  const allowedAdmins = ["alireza.akhoondi1@gmail.com"];

  return (
    <div className="App min-h-screen flex flex-col">
      <FavoritesProvider>
        <Header />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* مسیرهای عمومی */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/category/sewing-machine" element={<Category />} />
              <Route path="/about" element={<AboutUs />} />

              {/* مسیرهای محافظت‌شده برای کاربران */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />

              {/* مسیرهای محافظت‌شده برای ادمین */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/comments"
                element={
                  <AdminRoute>
                    <AdminComments />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/add-product"
                element={
                  <AdminRoute>
                    <AdminAddProducts />
                  </AdminRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
        {location.pathname !== "/verify" && location.pathname !== "/login" && <Footer />}
      </FavoritesProvider>
    </div>
  );
}

export default App;