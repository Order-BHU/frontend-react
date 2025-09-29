import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { myOrders, updateOrderStatus } from "@/api/restaurant";
import { useToast } from "@/hooks/use-toast";
import RestaurantOrderCard, { Order } from "@/components/restaurantOrderCard";
import ButtonLoader from "@/components/buttonLoader";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

const RestaurantOrdersTab = () => {
  const { toast } = useToast();
  const [acceptedOrderState, setAccepted] = useState<Order[]>([]);

  const [pendingOrderState, setPendingOrders] = useState<Order[]>([]);

  const [pendingId, setPendingId] = useState<number | null>(null);

  // Fetch pending orders
  const {
    data: pendingOrders,
    status: pendingStatus,
    refetch: refetchPending,
  } = useQuery({
    queryFn: () => myOrders("pending"),
    queryKey: ["pendingOrders"],
    refetchInterval: 10000,
  });

  // Fetch accepted orders
  const {
    data: acceptedOrders,
    status: acceptedStatus,
    refetch: refetchAccepted,
  } = useQuery({
    queryFn: () => myOrders("accepted"),
    queryKey: ["acceptedOrders"],
    refetchInterval: 10000,
  });
  useEffect(() => console.log("accepted: ", acceptedOrders), [acceptedOrders]);
  useEffect(() => console.log("pending: ", pendingOrders), [pendingOrders]);
  useEffect(
    () => console.log("pendingState: ", pendingOrderState),
    [pendingOrderState]
  );

  useEffect(() => {
    pendingOrders && setPendingOrders(pendingOrders.orders);
  }, [pendingOrders]);

  useEffect(() => {
    acceptedOrders && setAccepted(acceptedOrders.orders);
  }, [acceptedOrders]);

  // Accept order mutation

  // Update order status mutation
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatus({ orderId, status }),
    onSuccess: (data) => {
      toast({
        title: "Status Updated",
        description: data.message,
      });
      setPendingId(null);
      refetchAccepted();
      refetchPending();
      // Refetch orders to update UI
    },
    onError: (error: any) => {
      setPendingId(null);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (orderId: number, status: string) => {
    setPendingId(orderId);
    updateStatus({ orderId, status });
  };

  if (pendingStatus === "pending" || acceptedStatus === "pending") {
    return (
      <div className="flex justify-center items-center h-64">
        <ButtonLoader color="border-primary-500" />
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
              <RestaurantOrderCard
                key={order.id}
                order={order}
                onStatusChange={() => handleUpdateStatus(order.id, "accepted")}
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
            {acceptedOrderState.map((order: any) => (
              <RestaurantOrderCard
                key={order.order_id}
                order={order}
                onStatusChange={() =>
                  handleUpdateStatus(order.order_id, "ready")
                }
                isPendingForThisItem={pendingId === order.order_id}
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
