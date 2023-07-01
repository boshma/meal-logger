//src/components/util/UseEditModal.tsx
// Custom hooks for modals
import { useEffect, useRef, useState } from 'react';
import { FoodEntry, SavedMeal } from 'prisma/prisma-client';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useUser } from '@clerk/nextjs';

export const useEditModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFoodEntry, setCurrentFoodEntry] = useState<FoodEntry | null>(null);

  function openModal(foodEntry: FoodEntry) {
    setIsOpen(true);
    setCurrentFoodEntry(foodEntry);
  }

  function closeModal() {
    setIsOpen(false);
    setCurrentFoodEntry(null);
  }

  return {
    isOpen,
    currentFoodEntry,
    openModal,
    closeModal
  };
};

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

  const updateMutation = api.food.update.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been updated.");
      void ctx.food.getByDate.invalidate()
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to update food entry", e);
    },
  });

  const deleteMutation = api.food.delete.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been deleted.");
      void ctx.food.getByDate.invalidate()
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

export const useEditSavedMealModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSavedMeal, setCurrentSavedMeal] = useState<SavedMeal | null>(null);

  function openModal(savedMeal: SavedMeal) {
    setIsOpen(true);
    setCurrentSavedMeal(savedMeal);
  }

  function closeModal() {
    setIsOpen(false);
    setCurrentSavedMeal(null);
  }

  return {
    isOpen,
    currentSavedMeal,
    openModal,
    closeModal
  };
};



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

interface SearchedFoodEntry {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
}
export const useEditSearchedMealModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSearchedMeal, setCurrentSearchedMeal] = useState<SearchedFoodEntry | null>(null);

  function openModal(searchedMeal: SearchedFoodEntry) {
    setIsOpen(true);
    setCurrentSearchedMeal(searchedMeal);
  }

  function closeModal() {
    setIsOpen(false);
    setCurrentSearchedMeal(null);
  }

  return {
    isOpen,
    currentSearchedMeal,
    openModal,
    closeModal
  };
};

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


