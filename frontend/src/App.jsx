import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/admin/HomePage";
import ProductPage from "./pages/ProductPage";
import { useThemeStore } from "./stores/useThemeStore";
import { Toaster } from "react-hot-toast";
import SalePage from "./pages/SalePage";
import Footer from "./components/Footer";

function App() {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<SalePage />} />
        <Route path="/admin" element={<HomePage />} />
        <Route path="product/:id" element={<ProductPage />} />
      </Routes>

      <Footer></Footer>
      <Toaster />
    </div>
  );
}

export default App;
