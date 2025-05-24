import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
//import Marketplace from "./pages/Marketplace";\
import Marketplace from "./components/products/Marketplace";
import Awareness from "./pages/Awareness";
import Footer from "./components/footer";
import About from "./pages/About";
import ProductList from "./components/products/Fertiliser";
import FarmerProductUpload from "./components/products/Farmer_upload";
import FarmerCart from "./components/cart/Farmer_cart";
import ConsumerCart from "./components/cart/Product_cart";
import OrderList from "./components/products/orders";
import Login from "./auth/login";
import Register from "./auth/Register";
import AuthSuccess from "./auth/AuthSuccess";
import { Toaster } from 'react-hot-toast';
import ProductCard from "./components/products/Each_product";
import FertilizerCard from "./components/products/Each_fertilizer";
const App = () => {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnose" element={<Diagnose />} />
      <Route path="/marketplace" element={<Marketplace />} /> 
        <Route path="/awareness" element={<Awareness role="consumer" />} />
        <Route path="/about" element={<About />} />
        <Route path="/fertilisers" element={<ProductList />} />
        <Route path="/cart/fertilizer" element={<FarmerCart />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/cart/product" element={<ConsumerCart />} />
        <Route path="/orders" element={<OrderList/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product/:id" element={<ProductCard />} />
        <Route path="/fertilizer/:id" element={<FertilizerCard />} />
        <Route path="/list_items" element={<FarmerProductUpload />} />
      </Routes>
   
    </Router>
    </>
  );
};

export default App;

