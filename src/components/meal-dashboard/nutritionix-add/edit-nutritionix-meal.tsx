//src/components/meal-dashboard/nutritionix-add/edit-nutritionix-meal.tsx
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

interface SearchedFoodEntry {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
}

interface EditSearchedMealModalProps {
  searchedMeal: SearchedFoodEntry | null;
  handleClose: () => void;
  selectedDate: Date;
}

export const EditSearchedMealModal = ({ searchedMeal, handleClose, selectedDate }: EditSearchedMealModalProps) => {
  const [name, setName] = useState(searchedMeal?.name || '');
  const [protein, setProtein] = useState(searchedMeal?.protein.toString() || '');
  const [carbs, setCarbs] = useState(searchedMeal?.carbs.toString() || '');
  const [fat, setFat] = useState(searchedMeal?.fat.toString() || '');
  const user = useUser();
  const ctx = api.useContext();



  const addSearchedMealToLogMutation = api.food.addSearchedMealToLog.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been added to the log.");
      void ctx.food.getByDate.invalidate()
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to add meal to log", e);
      toast.error("Failed to add meal to log, please try again later!");
    },
  });


  const handleAddMealToLog = () => {
    // Get the timezone offset in minutes
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;

    // Create a new date object that includes the timezone offset
    const localISOTime = new Date(selectedDate.getTime() - timezoneOffset);

    // Generate dateString using localISOTime
    const dateString = `${localISOTime.getUTCFullYear()}-${String(localISOTime.getUTCMonth() + 1).padStart(2, '0')}-${String(localISOTime.getUTCDate()).padStart(2, '0')}T00:00:00Z`;

    // Attempt to add a meal to log with the generated dateString
    if (dateString) {
      addSearchedMealToLogMutation.mutate({
        userId: user.user?.id || '',
        meal: {
          name,
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
        },
        date: dateString,
      });
    } else {
      console.error("Failed to add meal to log: Date is undefined");
    }
  };

  if (!searchedMeal) {
    return null;
  }
  return (
    <Dialog open={!!searchedMeal}>
      <DialogContent  handleClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Add Searched Meal to Log</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleAddMealToLog(); }} className="p-4 space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Meal name"
            disabled
          />
          <Input
            id="protein"
            value={protein}
            onChange={e => setProtein(e.target.value)}
            label="Protein"
            placeholder="Protein"
            numeric
            disabled
          />
          <Input
            id="carbs"
            value={carbs}
            onChange={e => setCarbs(e.target.value)}
            label="Carbs"
            placeholder="Carbs"
            numeric
            disabled
          />
          <Input
            id="fat"
            value={fat}
            onChange={e => setFat(e.target.value)}
            label="Fat"
            placeholder="Fat"
            numeric
            disabled
          />
          <DialogFooter>
            <Button type="submit" >
              Add to Meal Log
            </Button>
            <Button onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};