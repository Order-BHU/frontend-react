import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { myOrders, updateOrderStatus } from "@/api/restaurant";
import { orderType } from "@/interfaces/restaurantType";
import { useToast } from "@/hooks/use-toast";
import OrderCard, { Order } from "@/components/newOrderCard";
import ButtonLoader from "@/components/buttonLoader";

interface RestaurantOrdersTabProps {
  restaurantId: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

const RestaurantOrdersTab: React.FC<RestaurantOrdersTabProps> = ({
  restaurantId,
}) => {
  const { toast } = useToast();
  const [acceptedOrderState, setAccepted] = useState<Order[]>([]);

  const [pendingOrderState, setPendingOrders] = useState<Order[]>([]);

  const [pendingId, setPendingId] = useState<number | null>(null);
  const [acceptedId, setAcceptedId] = useState<number | null>(null);

  // Fetch pending orders
  const { data: pendingOrders, status: pendingStatus } = useQuery({
    queryFn: () => myOrders("pending"),
    queryKey: ["pendingOrders"],
    refetchInterval: 10000,
  });

  // Fetch accepted orders
  const { data: acceptedOrders, status: acceptedStatus } = useQuery({
    queryFn: () => myOrders("accepted"),
    queryKey: ["acceptedOrders"],
    refetchInterval: 10000,
  });

  useEffect(() => {
    pendingOrders && setPendingOrders(pendingOrders);
  }, [pendingOrders]);

  useEffect(() => {
    acceptedOrders && setAccepted(acceptedOrders);
  }, [acceptedOrders]);

  // Accept order mutation
  const { mutate: acceptOrder } = useMutation({
    mutationFn: ({ orderId }: { orderId: number }) =>
      updateOrderStatus({ orderId, status: "accepted" }),
    onSuccess: (data) => {
      toast({
        title: "Order Accepted",
        description: data.message,
      });
      setPendingId(null);
      // Refetch orders to update UI
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setPendingId(null);
    },
  });

  // Update order status mutation
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({
      orderId,
      status,
      code,
    }: {
      orderId: number;
      status: string;
      code?: string;
    }) => updateOrderStatus({ orderId, status, code }),
    onSuccess: (data) => {
      toast({
        title: "Status Updated",
        description: data.message,
      });
      setAcceptedId(null);
      // Refetch orders to update UI
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setAcceptedId(null);
    },
  });

  const handleAcceptOrder = (orderId: number) => {
    setPendingId(orderId);
    acceptOrder({ orderId });
  };

  const handleUpdateStatus = (
    orderId: number,
    status: string,
    code?: string
  ) => {
    setAcceptedId(orderId);
    updateStatus({ orderId, status, code });
  };

  if (pendingStatus === "pending" || acceptedStatus === "pending") {
    return (
      <div className="flex justify-center items-center h-64">
        <ButtonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Orders */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={1}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-secondary-900">
          Pending Orders
        </h3>
        {pendingOrderState.length > 0 ? (
          <div className="grid gap-4">
            {pendingOrderState.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={() => handleAcceptOrder(order.id)}
                isPendingForThisItem={pendingId === order.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-secondary-500">
            No pending orders at the moment
          </div>
        )}
      </motion.div>

      {/* Accepted Orders */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={2}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-secondary-900">
          Accepted Orders
        </h3>
        {acceptedOrderState.length > 0 ? (
          <div className="grid gap-4">
            {acceptedOrderState.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={(orderId, status, code) =>
                  handleUpdateStatus(orderId, status, code)
                }
                isLoading={acceptedId === order.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-secondary-500">
            No accepted orders at the moment
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RestaurantOrdersTab;
