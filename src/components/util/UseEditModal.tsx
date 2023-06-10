//src/components/util/UseEditModal.tsx
// Custom hooks for modals
import { useState } from 'react';
import { FoodEntry, SavedMeal } from 'prisma/prisma-client';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';
import { Button } from '../button';
import { Input } from '../input';
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../dialog';

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
}



export const EditModal = ({ foodEntry, handleClose }: EditModalProps) => {
  const [name, setName] = useState(foodEntry?.name || "");
  const [protein, setProtein] = useState<string>(foodEntry?.protein?.toString() || "");
  const [carbs, setCarbs] = useState<string>(foodEntry?.carbs?.toString() || "");
  const [fat, setFat] = useState<string>(foodEntry?.fat?.toString() || "");



  const ctx = api.useContext();
  if (!foodEntry) return null;

  const updateMutation = api.food.update.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been updated.");
      // Refetch the meal log after successful update
      void ctx.food.getByDate.invalidate()
      handleClose(); // Close dialog after successful update
    },
    onError: (e) => {
      console.error("Failed to update food entry", e);
    },
  });

  const deleteMutation = api.food.delete.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been deleted.");
      void ctx.food.getByDate.invalidate()
      handleClose(); // Close dialog after successful deletion
    },
    onError: (e) => {
      console.error("Failed to delete food entry", e);
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mutate the food entry
    if (foodEntry) {
      updateMutation.mutate({
        id: foodEntry.id,
        name,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
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
}

export const EditSavedMealModal = ({ savedMeal, handleClose }: EditSavedMealModalProps) => {
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
      addMealToLogMutation.mutate({
        userId: savedMeal.userId,
        mealId: savedMeal.id,
        date: new Date().toISOString(),
      });
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