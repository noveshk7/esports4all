import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./routes/PrivateRoute";
import MyResources from "./pages/MyResources";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";
import Terms from "./pages/policies/Terms";
import Disclaimer from "./pages/policies/Disclaimer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      {/* 🔥 GLOBAL SCROLL FIX */}
      <ScrollToTop />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />

        {/* POLICIES */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        {/* 🔒 PROTECTED ROUTE */}
        <Route
          path="/my-resources"
          element={
            <PrivateRoute>
              <MyResources />
            </PrivateRoute>
          }
        />

        {/* 🔒 ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;