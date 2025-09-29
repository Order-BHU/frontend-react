import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiPlus, FiEdit2, FiTrash } from "react-icons/fi";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCategories,
  getMenuItems,
  addMenu,
  editMenu,
  deleteMenuItem,
  updateItemAvailability,
} from "@/api/restaurant";
import { menuItem, category } from "@/interfaces/restaurantType";
import { useToast } from "@/hooks/use-toast";
import ButtonLoader from "@/components/buttonLoader";

interface RestaurantMenuTabProps {
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

const RestaurantMenuTab: React.FC<RestaurantMenuTabProps> = ({
  restaurantId,
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<menuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null as File | null,
  });
  const [menuItemArrayState, setmenuItemArray] = useState<menuItem[]>([]);

  // Fetch menu items
  const {
    data: menuData,
    isPending: menuPending,
    refetch: refetchMenu,
  } = useQuery({
    queryFn: () => getMenuItems(restaurantId), // Assuming restaurant ID is 1
    queryKey: ["menuItems", "1"],
  });
  useEffect(() => {
    if (menuData) {
      console.log("menu data:", menuData);
      const allItems = menuData.menu?.flatMap(
        (category: any) => category.menus
      );
      setmenuItemArray(allItems);
    }
  }, [menuData]);

  useEffect(() => {
    console.log("menu state: ", menuItemArrayState);
  }, [menuItemArrayState]);

  // Fetch categories
  const { data: categories, status: categoryStatus } = useQuery({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  // Add menu item mutation
  const { mutate: addMenuItem, isPending: isAdding } = useMutation({
    mutationFn: (menuData: any) => addMenu(menuData),
    onSuccess: (data) => {
      toast({
        title: "Menu Item Added",
        description: data.message,
      });
      setIsAddDialogOpen(false);
      setNewMenuItem({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: null,
      });
      refetchMenu();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Edit menu item mutation
  const { mutate: editMenuItem, isPending: isEditing } = useMutation({
    mutationFn: (menuData: any) => editMenu(menuData),
    onSuccess: (data) => {
      toast({
        title: "Menu Item Updated",
        description: data.message,
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      refetchMenu();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete menu item mutation
  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (menuId: number) => deleteMenuItem(menuId),
    onSuccess: (data) => {
      toast({
        title: "Menu Item Deleted",
        description: data.message,
      });
      refetchMenu();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update availability mutation
  const { mutate: updateAvailability } = useMutation({
    mutationFn: ({ menuid, value }: { menuid: number; value: 1 | 0 }) =>
      updateItemAvailability({ menuid, value }),
    onSuccess: (data) => {
      toast({
        title: "Availability Updated",
        description: data.message,
      });
      refetchMenu();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const menuData = {
      id: restaurantId, // Restaurant ID
      name: newMenuItem.name,
      description: newMenuItem.description,
      price: parseFloat(newMenuItem.price),
      category_id: parseInt(newMenuItem.category_id),
      image: newMenuItem.image,
    };

    addMenuItem(menuData);
  };

  const handleEditMenuItem = () => {
    if (!editingItem) return;

    const menuData = {
      id: restaurantId, // Restaurant ID
      menu_id: editingItem.id,
      name: editingItem.name,
      description: editingItem.description,
      price: editingItem.price,
      category_id: editingItem.category_id,
      image: editingItem.image,
    };

    editMenuItem(menuData);
  };

  const handleAvailabilityToggle = (
    menuId: number,
    currentAvailability: 1 | 0
  ) => {
    const newValue = currentAvailability === 1 ? 0 : 1;
    updateAvailability({ menuid: menuId, value: newValue });
  };

  const handleEditClick = (item: menuItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  if (menuPending || categoryStatus === "pending") {
    return (
      <div className="flex justify-center items-center h-64">
        <ButtonLoader color="border-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add Menu Item Button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={1}
        className="flex justify-between items-center"
      >
        <h3 className="text-2xl font-bold text-secondary-900">
          Menu Management
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newMenuItem.name}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, name: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMenuItem.description}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter item description"
                />
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newMenuItem.price}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newMenuItem.category_id}
                  onValueChange={(value) =>
                    setNewMenuItem({ ...newMenuItem, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      image: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleAddMenuItem}
                disabled={isAdding}
                className="w-full"
              >
                {isAdding ? <ButtonLoader /> : "Add Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Menu Items Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={2}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {menuItemArrayState &&
          menuItemArrayState.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(item)}
                  disabled={isEditing || isDeleting}
                >
                  <FiEdit2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">₦{item.price}</span>
                <div className="flex gap-2">
                  <Button
                    variant={
                      item.is_available === 1 ? "destructive" : "default"
                    }
                    size="sm"
                    onClick={() =>
                      handleAvailabilityToggle(item.id, item.is_available)
                    }
                    disabled={isDeleting}
                  >
                    {item.is_available === 1 ? "Available" : "Unavailable"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    disabled={isDeleting}
                  >
                    <FiTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </motion.div>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter item description"
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      price: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="edit-image">Image</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      image: e.target.files?.[0] || editingItem.image,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleEditMenuItem}
                disabled={isEditing}
                className="w-full"
              >
                {isEditing ? <ButtonLoader /> : "Update Item"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantMenuTab;
