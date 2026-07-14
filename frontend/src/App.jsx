import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/Home/HomePage";
import ProductDetailsPage from "./pages/ProductDetails/ProductDetailsPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} pauseOnHover />
    </BrowserRouter>
  );
}

export default App;
