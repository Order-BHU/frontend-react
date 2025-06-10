import React, { useEffect, useState } from "react";
import { Check, CreditCard, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: string;
  reference: string | null;
  paymentStatus: string;
}

//type PaymentStatus = "pending" | "success" | "idle" | "error";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  reference,
  paymentStatus,
}) => {
  const [status, setStatus] = useState<string>(paymentStatus);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStatus("pending");
      setProgress(0);

      // Simulate payment pending with progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setStatus("success"), 300);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(progressInterval);
    } else {
      setStatus("idle");
      setProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border shadow-2xl rounded-2xl p-8 mx-4 w-full max-w-md animate-scale-in">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {status === "pending" ? "pending Payment" : "Payment Successful"}
            </h2>
            <p className="text-muted-foreground">
              Order {reference} • {amount}
            </p>
          </div>

          {/* Animation Container */}
          <div className="relative flex items-center justify-center h-32">
            {status === "pending" && (
              <div className="relative">
                {/* Outer ring */}
                <div className="w-24 h-24 rounded-full border-4 border-muted animate-pulse" />

                {/* Progress ring */}
                <svg
                  className="absolute inset-0 w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-primary"
                    strokeDasharray={`${progress * 2.51} 251`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.1s ease" }}
                  />
                </svg>

                {/* Inner content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-2 text-center">
                    <CreditCard className="w-8 h-8 text-primary mx-auto animate-pulse" />
                    <div className="text-sm font-medium text-foreground">
                      {progress}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="relative animate-scale-in">
                {/* Success ring */}
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 border-4 border-green-500 flex items-center justify-center">
                  <Check
                    className="w-12 h-12 text-green-500 animate-scale-in"
                    strokeWidth={3}
                  />
                </div>

                {/* Success ripple effect */}
                <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="space-y-2">
            {status === "pending" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Verifying your payment details...
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">
                    This may take a few seconds
                  </span>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Your payment has been processed successfully!
                </p>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Transaction ID
                    </span>
                    <span className="font-mono">
                      TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <span>UPI</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {status === "success" && (
            <button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-3 px-4 font-medium transition-colors animate-fade-in"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
