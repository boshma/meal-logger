import { FoodEntry } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

interface EditModalProps {
  foodEntry: FoodEntry | null;
  handleClose: () => void;
  originalProtein: React.RefObject<number>;
  originalCarbs: React.RefObject<number>;
  originalFat: React.RefObject<number>;
}

export const EditModal = ({
  foodEntry,
  handleClose,
  originalProtein,
  originalCarbs,
  originalFat,
}: EditModalProps) => {
  const [name, setName] = useState(foodEntry?.name || "");
  const [protein, setProtein] = useState<string>(foodEntry?.protein?.toString() || "0");
  const [carbs, setCarbs] = useState<string>(foodEntry?.carbs?.toString() || "0");
  const [fat, setFat] = useState<string>(foodEntry?.fat?.toString() || "0");
  const [servingSize, setServingSize] = useState<string>(foodEntry?.servingSize?.toString() || "1");

  // Local state for original values
  const [origProtein, setOrigProtein] = useState(originalProtein.current);
  const [origCarbs, setOrigCarbs] = useState(originalCarbs.current);
  const [origFat, setOrigFat] = useState(originalFat.current);

  useEffect(() => {
    if (foodEntry) {
      // Update local state
      setOrigProtein(originalProtein.current);
      setOrigCarbs(originalCarbs.current);
      setOrigFat(originalFat.current);

      setServingSize(foodEntry.servingSize.toString());
      // set the state for protein, carbs, and fat too
      setProtein(foodEntry.protein.toString());
      setCarbs(foodEntry.carbs.toString());
      setFat(foodEntry.fat.toString());
    }
  }, [foodEntry, originalProtein.current, originalCarbs.current, originalFat.current]);



  const ctx = api.useContext();
  if (!foodEntry) return null;

  const updateMutation = api.mealLog.update.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been updated.");
      void ctx.mealLog.getByDate.invalidate()
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to update food entry", e);
    },
  });

  const deleteMutation = api.mealLog.delete.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been deleted.");
      void ctx.mealLog.getByDate.invalidate()
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to delete food entry", e);
    },
  });

  const handleServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newServingSize = parseFloat(e.target.value);
    if (isNaN(newServingSize) || newServingSize === 0) {
      setServingSize("");
      return;
    }

    // Calculate new values based on original values and new serving size
    setProtein(((origProtein ?? 0) * newServingSize).toString());
    setCarbs(((origCarbs ?? 0) * newServingSize).toString());
    setFat(((origFat ?? 0) * newServingSize).toString());

    // Update serving size after new values are set
    setServingSize(newServingSize.toString());
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodEntry) {
      updateMutation.mutate({
        id: foodEntry.id,
        name,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        servingSize: parseFloat(servingSize) || 1,
        date: foodEntry.date.toISOString(),
      });
    }
  };
  return (
    <Dialog open={!!foodEntry}>
      <DialogContent handleClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Edit Food Entry</DialogTitle>
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
          <Input
            type="number"
            id="servingSize"
            value={servingSize}
            onChange={handleServingSizeChange}
            label="Serving Size"
            placeholder="Serving Size"
            numeric
            min="0"
            max="100"
          />

          <DialogFooter>
            <Button type="submit" >
              Update
            </Button>
            <Button onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate({ id: foodEntry.id });
            }}>
              Delete
            </Button>


          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};