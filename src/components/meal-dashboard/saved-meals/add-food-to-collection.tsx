//src/components/meal-dashboard/saved-meals/add-food-to-collection.tsx
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button, ButtonLoading } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

export const SavedMealFormDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  const user = useUser();
  const [name, setName] = useState("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const ctx = api.useContext();

  const mutation = api.food.createSavedMeal.useMutation({
    onSuccess: () => {
      toast.success("Saved meal created");
      void ctx.food.getSavedMeals.invalidate();
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
      handleClose();
    },
    onError: (e) => {
      toast.error("Failed to create saved meal");
      console.error("Failed to create saved meal", e);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      userId: user.user?.id || "",
      data: {
        name,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
      },
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent handleClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Add Saved Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Food name"
          />
          <Input
            id="protein"
            value={protein}
            onChange={e => setProtein(e.target.value)}
            label="Protein"
            placeholder="Protein"
            numeric
          />
          <Input
            id="carbs"
            value={carbs}
            onChange={e => setCarbs(e.target.value)}
            label="Carbs"
            placeholder="Carbs"
            numeric
          />
          <Input
            id="fat"
            value={fat}
            onChange={e => setFat(e.target.value)}
            label="Fat"
            placeholder="Fat"
            numeric
          />
          <DialogFooter>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? <ButtonLoading /> : "Save Food"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};