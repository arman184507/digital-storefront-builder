import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateStore from "./pages/CreateStore";
import TemplateSelection from "./pages/TemplateSelection";
import StoreEditor from "./pages/StoreEditor";
import ProductCatalog from "./pages/ProductCatalog";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import MyStores from "./pages/MyStores";
import Storefront from "./pages/Storefront";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Owner Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-stores"
            element={
              <ProtectedRoute>
                <MyStores />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-store"
            element={
              <ProtectedRoute>
                <CreateStore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <TemplateSelection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store-editor"
            element={
              <ProtectedRoute>
                <StoreEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductCatalog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Public Customer Pages */}
          <Route path="/storefront" element={<Storefront />} />
          <Route path="/store/:storeUrl" element={<Storefront />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;