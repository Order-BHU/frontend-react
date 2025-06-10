import { useState } from "react";

interface PaymentDetails {
  amount: number;
  reference: string | null;
}
interface modalProps {
  amount: number;
  reference: string | null;
}

export const usePaymentModal = ({ amount, reference }: modalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: amount,
    reference: reference,
  });

  const openModal = (details?: Partial<PaymentDetails>) => {
    if (details) {
      setPaymentDetails((prev) => ({ ...prev, ...details }));
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    paymentDetails,
    openModal,
    closeModal,
  };
};
