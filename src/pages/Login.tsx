import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import UseAuthStore from "@/stores/useAuthStore";

export default function LoginPage() {
  const { logIn } = UseAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { status, mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.account_type === "restaurant") {
        localStorage.setItem("name", data.restaurant_name);
      }
      if (data.account_type === "customer") {
        localStorage.setItem("name", data.name);
      }
      localStorage.setItem("token", data.token);
      logIn(`${data.account_type}`);
      navigate(`/${data.account_type}-dashboard/`);
      toast({
        title: "success!",
        description: data.message,
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:text-cfont-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md dark:bg-cbg-dark">
          <h1 className="text-3xl font-bold mb-6 text-center text-orange-600 dark:text-cfont-dark">
            Log In
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="dark:text-cfont-dark">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                className="dark:text-cfont-dark"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="dark:text-cfont-dark">
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="dark:text-cfont-dark"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={status === "pending"}
            >
              {status === "pending" ? "Loading..." : "Log In"}
            </Button>
          </form>
          <div className="mt-6">
            <Separator className="my-4" />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert("Google login not implemented")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 533.5 544.3"
                className="w-5 h-5 mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-17.3-1.5-33.7-4.3-49.5H272.2v93.7h146.4c-6.3 33.3-25.4 61.5-54.6 80.2l89.2 69c52.3-48.3 80.3-119.5 80.3-193.4z"
                />
                <path
                  fill="#34A853"
                  d="M272.2 544.3c72.4 0 133.1-23.8 177.5-64.5l-89.2-69c-24.8 16.7-56.4 26.7-88.3 26.7-68.1 0-125.8-45.8-146.5-107.2l-92.6 71.6c43.6 87 134 142.4 239.1 142.4z"
                />
                <path
                  fill="#FBBC04"
                  d="M125.7 330.2c-11.2-33.3-11.2-69.4 0-102.7l-92.5-71.6c-39.9 78.8-39.9 169.2 0 248z"
                />
                <path
                  fill="#EA4335"
                  d="M272.2 107.6c38.9 0 74.1 13.5 101.8 39.7l76.1-76.1C394.5 24.7 336.5 0 272.2 0c-105.2 0-195.5 55.5-239.1 142.4l92.6 71.6C146.4 153.4 204.1 107.6 272.2 107.6z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{""}
            <Link to="/signup" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
