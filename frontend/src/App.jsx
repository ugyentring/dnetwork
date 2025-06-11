import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import { useAuth } from "./context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Administrator privileges required to access this page
      </div>
    );
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/edit/:id"
                element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
