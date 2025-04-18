import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import UseAuthStore from "@/stores/useAuthStore";
import driverStore from "@/stores/driverStore";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { logIn } = UseAuthStore();
  const { setState } = driverStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { status, mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.account_type === "restaurant") {
        localStorage.setItem("name", data?.restaurant_name);
        localStorage.setItem("restaurant_id", data?.restaurant_id);
      }

      if (data.account_type === "driver") {
        //this logic will deal with assigning the state for the driver's status: online or offline
        setState(data?.status);
      }

      if (data?.account_type != "restaurant") {
        localStorage.setItem("name", data?.name);
      }
      localStorage.setItem("token", data?.token ?? "undefined");
      localStorage.setItem("accountType", data?.account_type ?? "undefined");

      if (localStorage.getItem("itemId")) {
        navigate(`/menu/${Number(localStorage?.getItem("restaurantId"))}`);
        toast({
          title: "success!",
          description: data?.message,
        });
      }
      if (
        localStorage.getItem("accountType") !== "undefined" &&
        localStorage.getItem("token") !== "undefined"
      ) {
        //I want it to check to see if the accountType actually exists before using the login function. doing this because the driver account thing is weird and it messes with the logic. When drivers get "logged in" they aren't assigned a token or an account type, so they get logged in to the frontend and can't really do anything
        logIn(`${localStorage.getItem("accountType")}`);
        navigate(`/${data.account_type}-dashboard/`);
        toast({
          title: "success!",
          description: data?.message,
        });
      } else {
        throw new Error("can't log in!!");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes("verified")) {
        const source = "/login";

        navigate("/verify-otp/", { state: { formData, source } });
      }
      return;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://bhuorder.com.ng") return;

      const { token, user } = event.data;
      console.log("received stuff: ", event);

      if (token) {
        console.log("token: ", token);
        localStorage.setItem("token", token);
        user?.account_type &&
          localStorage.setItem("accountType", user?.account_type);
        logIn(user?.account_type);
        localStorage.setItem("user", JSON.stringify(user));

        // redirect or update UI
        user?.account_type && navigate(`/${user?.account_type}-dashboard/`);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 mt-10">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8 transition-all duration-300 hover:shadow-xl animate-fade-in">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              disabled={status === "pending"}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  const width = 500;
                  const height = 600;
                  const left = window.innerWidth / 2 - width / 2;
                  const top = window.innerHeight / 2 - height / 2;

                  window.open(
                    "https://bhuorder.com.ng/api/auth/google",
                    "GoogleLoginPopup",
                    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                  );
                }}
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all hover:border-gray-400 shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-medium text-orange-500 hover:text-orange-600"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
