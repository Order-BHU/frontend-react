import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import LandingPage from "./pages/Landingpage";
import RestaurantsPage from "./pages/Restaurants";
import ContactPage from "./pages/Contact";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/Signup";
import CartPage from "./pages/Cart";
import RiderDashboardPage from "./pages/RiderDashboard";
import RestaurantDashboardPage from "./pages/RestaurantDashboard";
import UserDashboardPage from "./pages/UserDashboard";
import RestaurantMenuPage from "./pages/Menupage";
import AdminDashboardPage from "./pages/Adminpage";
import PageWrapper from "./components/pagewrapper";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/404" element={<div>can't find item</div>}></Route>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/restaurants" element={<RestaurantsPage />}></Route>
          <Route path="/contact" element={<ContactPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/cart" element={<CartPage />}></Route>
          <Route path="/menu/:id" element={<RestaurantMenuPage />}></Route>
          <Route
            path="/rider-dashboard"
            element={<RiderDashboardPage />}
          ></Route>
          <Route
            path="/restaurant-dashboard"
            element={<RestaurantDashboardPage />}
          ></Route>
          <Route path="/user-dashboard" element={<UserDashboardPage />}></Route>
          <Route
            path="/admin-dashboard"
            element={<AdminDashboardPage />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
