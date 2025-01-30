"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { verifyAccount, getOtp } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTPPage() {
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const location = useLocation();
  const email = location.state?.formData.email;
  const source = location.state.source;
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [countdown, isResendDisabled]);
  const verifyMutation = useMutation({
    mutationFn: verifyAccount,
    onSuccess: (data) => {
      if (source === "/login") {
        navigate("/");
      } else {
        navigate("/login");
      }
      toast({
        title: "OTP Submitted!",
        description: data.message + "/n You can now log in",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({
      email: email,
      otp: otp,
    });
    // Reset OTP input after submission
    setOtp("");
  };

  const resendMutation = useMutation({
    mutationFn: getOtp,
    onSuccess: () => {
      navigate("/user-dashboard/");
      console.log("request submitted:", otp);
      toast({
        title: "Sending an OTP",
        description: "Check your email for an OTP",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    },
  });

  const handleClick = () => {
    setIsResendDisabled(true);
    setCountdown(59);
    resendMutation.mutate({
      email: email,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Verify Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Please enter the 4-digit code sent to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  type="text"
                  id="otp"
                  placeholder="Enter 4-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMutation.status === "pending"}
              >
                {verifyMutation.status === "pending" ? "loading..." : "Verify"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => handleClick()}
                disabled={isResendDisabled}
              >
                Resend
                {isResendDisabled && countdown > 0 && ` (${countdown}s)`}
              </Button>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
