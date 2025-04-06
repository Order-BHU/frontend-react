import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import RestaurantsPage from "./pages/Restaurants";
import ContactPage from "./pages/Contact";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/Signup";
import RiderDashboardPage from "./pages/RiderDashboard";
import RestaurantDashboardPage from "./pages/RestaurantDashboard";
import UserDashboardPage from "./pages/UserDashboard";
import RestaurantMenuPage from "./pages/Menupage";
import AdminDashboardPage from "./pages/Adminpage";
import { ThemeProvider } from "@/components/theme-provider";
import VerifyOTPPage from "./pages/verifyOtpPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/protectedRoute";
import ToastAutoDismiss from "./components/dismisstoast"; //handles dismissing toast when screen tapped
import { waveform, orbit } from "ldrs";
import { Header } from "./components/header";

function App() {
  waveform.register();
  orbit.register();
  const queryClient = new QueryClient();
  return (
    <div className="app">
      <ToastAutoDismiss />
      <Toaster />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <QueryClientProvider client={queryClient}>
            <Header />
            <Routes>
              <Route path="*" element={<NotFound />}></Route>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/restaurants" element={<RestaurantsPage />}></Route>
              <Route path="/contact" element={<ContactPage />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignUpPage />}></Route>
              <Route path="/menu/:id" element={<RestaurantMenuPage />}></Route>
              <Route path="/verify-otp" element={<VerifyOTPPage />}></Route>
              <Route
                path="/driver-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["driver"]}>
                    <RiderDashboardPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/restaurant-dashboard"
                element={
                  // <ProtectedRoute allowedRoles={["restaurant"]}>
                  <RestaurantDashboardPage />
                  // </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/customer-dashboard"
                element={
                  // <ProtectedRoute allowedRoles={["customer"]}>
                  <UserDashboardPage />
                  // </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
