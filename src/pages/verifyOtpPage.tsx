"use client";

import { useState } from "react";
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

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP code.",
        variant: "destructive",
      });
      return;
    }
    // Here you would typically send the OTP to your backend for verification
    console.log("OTP submitted:", otp);
    toast({
      title: "OTP Submitted",
      description: "Your OTP has been submitted for verification.",
    });
    // Reset OTP input after submission
    setOtp("");
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
              Please enter the 6-digit code sent to your phone or email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() =>
                  toast({
                    title: "New code sent",
                    description:
                      "A new verification code has been sent to your phone or email.",
                  })
                }
              >
                Resend
              </Button>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
