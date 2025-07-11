import React, { useEffect, useState } from "react";
import { AlertCircle, Check, CreditCard, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStatus(paymentStatus);
      setProgress(0);

      // Simulate payment pending with progress
    } else {
      setStatus("idle");
      setProgress(0);
    }
  }, [isOpen, status]);

  useEffect(() => {
    setStatus(paymentStatus);
  }, [paymentStatus]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border shadow-2xl rounded-2xl p-8 mx-4 w-full max-w-md animate-scale-in">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {status === "pending"
                ? "Processing Payment"
                : status === "success"
                ? "Payment Successful"
                : "Payment Failed"}
            </h2>
            <p className="text-muted-foreground">
              Order {reference} • ₦{amount}
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

            {status === "error" && (
              <div className="relative animate-scale-in">
                {/* Error ring */}
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 border-4 border-red-500 flex items-center justify-center">
                  <X
                    className="w-12 h-12 text-red-500 animate-scale-in"
                    strokeWidth={3}
                  />
                </div>

                {/* Error pulse effect */}
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-pulse opacity-30" />
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
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    Payment could not be processed
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {status === "success" && (
            <button
              onClick={() => navigate("/customer-dashboard")}
              className="w-full bg-primary-500 text-primary-foreground hover:bg-primary-500/90 rounded-lg py-3 px-4 font-medium transition-colors animate-fade-in"
            >
              View Order
            </button>
          )}

          {status === "error" && (
            <div className="space-y-3 animate-fade-in">
              <button
                onClick={onClose}
                className="w-full bg-primary-900 text-muted-foreground hover:bg-primary-900/80 rounded-lg py-3 px-4 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
