import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 MAIN LAYOUT (WITH NAVBAR + FOOTER) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Route>

                {/* 🔐 AUTH PAGES (NO NAVBAR) */}
                <Route
          path="/login"
          element={
            <AuthLayout title="Welcome Back" subtitle="Login to continue Shopping">
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthLayout title="Create Account" subtitle="Join BharatCart">
              <Signup />
            </AuthLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;