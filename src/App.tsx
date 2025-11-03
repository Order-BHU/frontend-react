import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { LoadingSpinner } from "./components/LazyWrapper";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/Landingpage"));
const RestaurantsPage = lazy(() => import("./pages/restaurantsPage"));
const ContactPage = lazy(() => import("./pages/Contact"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const RiderDashboardPage = lazy(() => import("./pages/RiderDashboard"));
const DronePitch = lazy(() => import("./pages/Drones/DronePitch"));
const RestaurantDashboardPage = lazy(
  () => import("./pages/RestaurantDashboard")
);
const UserDashboardPage = lazy(() => import("./pages/UserDashboard"));
const RestaurantMenuPage = lazy(() => import("./pages/Menupage/Menupage"));
const AdminDashboardPage = lazy(() => import("./pages/Admin/Adminpage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyOTPPage = lazy(() => import("./pages/verifyOtpPage"));
const ContactList = lazy(() => import("./pages/ContactList/ContactList"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "./components/protectedRoute";
import ToastAutoDismiss from "./components/dismisstoast"; //handles dismissing toast when screen tapped
import { waveform, orbit } from "ldrs";
import Header from "./components/header";
import Footer from "./components/footer";
import CountDownRedirect from "@/pages/ClosedPage/components/countdownRedirect";
import ErrorBoundary from "./components/ErrorBoundary";
//import MobileAppDownloadModal from "./components/MobileAppDownloadModal";

function App() {
  waveform.register();
  orbit.register();
  const queryClient = new QueryClient();

  const ScrollToTop = () => {
    //here to get rid of the scroll location so each page starts from the top when navigating
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <ToastAutoDismiss />

        <Toaster />
        {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <QueryClientProvider client={queryClient}>
            <ScrollToTop />
            <Header />
            {/* <MobileAppDownloadModal /> */}
            <CountDownRedirect>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="*" element={<NotFound />}></Route>
                  <Route path="/" element={<LandingPage />}></Route>
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                  ></Route>
                  <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                  ></Route>
                  <Route
                    path="/restaurants"
                    element={<RestaurantsPage />}
                  ></Route>
                  <Route path="/contact" element={<ContactPage />}></Route>
                  <Route path="/login" element={<LoginPage />}></Route>
                  <Route path="/signup" element={<SignUpPage />}></Route>
                  <Route
                    path="/menu/:id"
                    element={<RestaurantMenuPage />}
                  ></Route>
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
                      <ProtectedRoute allowedRoles={["restaurant"]}>
                        <RestaurantDashboardPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/customer-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["customer"]}>
                        <UserDashboardPage />
                      </ProtectedRoute>
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
                  <Route
                    path="/admin/contact"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <ContactList />
                      </ProtectedRoute>
                    }
                  ></Route>

                  <Route
                    path="/drone-delivery"
                    element={<DronePitch />}
                  ></Route>
                </Routes>
              </Suspense>
            </CountDownRedirect>
            <ReactQueryDevtools />
          </QueryClientProvider>
          <Footer />
        </BrowserRouter>
        {/* </ThemeProvider> */}
      </div>
    </ErrorBoundary>
  );
}

export default App;
