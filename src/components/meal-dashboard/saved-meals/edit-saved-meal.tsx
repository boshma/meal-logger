//src/components/meal-dashboard/saved-meals/edit-saved-meal.tsx
import { SavedMeal } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

interface EditSavedMealModalProps {
  savedMeal: SavedMeal | null;
  handleClose: () => void;
  selectedDate: Date;
}

export const EditSavedMealModal = ({ savedMeal, handleClose, selectedDate }: EditSavedMealModalProps) => {
  const [name, setName] = useState(savedMeal?.name || '');
  const [protein, setProtein] = useState(savedMeal?.protein.toString() || '');
  const [carbs, setCarbs] = useState(savedMeal?.carbs.toString() || '');
  const [fat, setFat] = useState(savedMeal?.fat.toString() || '');


  const ctx = api.useContext();
  if (!savedMeal) {
    return null;
  }

  const addMealToLogMutation = api.food.addMealToLog.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been added to the log.");
      void ctx.food.getSavedMeals.invalidate();
      void ctx.food.getByDate.invalidate();
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to add meal to log", e);
      toast.error("Failed to add meal to log, please try again later!");
    },
  });

  const updateMutation = api.food.updateSavedMeal.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been updated.");
      void ctx.food.getSavedMeals.invalidate();
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to update meal", e);
      toast.error("Failed to update meal, please try again later!");
    },
  });

  const deleteMutation = api.food.deleteSavedMeal.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been deleted.");
      void ctx.food.getSavedMeals.invalidate();
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to delete meal", e);
      toast.error("Failed to delete meal, please try again later!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    if (!savedMeal) {
      return null;
    }
    e.preventDefault();
    if (savedMeal) {
      updateMutation.mutate({
        userId: savedMeal.userId,
        mealId: savedMeal.id,
        data: {
          name,
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,

        },
      });
    }
  };

  const handleDelete = () => {
    if (!savedMeal) {
      return null;
    }
    if (savedMeal) {
      deleteMutation.mutate({
        userId: savedMeal.userId,
        mealId: savedMeal.id
      });
    }
  };

  const handleAddMealToLog = () => {
    if (!savedMeal) {
      return null;
    }
    if (savedMeal) {
      // Get the timezone offset in minutes
      const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;

      // Create a new date object that includes the timezone offset
      const localISOTime = new Date(selectedDate.getTime() - timezoneOffset);

      // Generate dateString using localISOTime
      const dateString = `${localISOTime.getUTCFullYear()}-${String(localISOTime.getUTCMonth() + 1).padStart(2, '0')}-${String(localISOTime.getUTCDate()).padStart(2, '0')}T00:00:00Z`;

      // Attempt to add a meal to log with the generated dateString
      if (dateString) {
        addMealToLogMutation.mutate({
          userId: savedMeal.userId,
          mealId: savedMeal.id,
          date: dateString,
        });
      } else {
        console.error("Failed to add meal to log: Date is undefined");
      }
    }
  };


  return (
    <Dialog open={!!savedMeal}>
      <DialogContent handleClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Edit Saved Meal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Meal name"
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
            <Button type="submit" >
              Update
            </Button>
            <Button onClick={(e) => {
              e.preventDefault();
              handleAddMealToLog();
            }}>
              Add to Meal Log
            </Button>
            <Button onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate({ mealId: savedMeal.id, userId: savedMeal.userId });
            }}>
              Delete
            </Button>

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};