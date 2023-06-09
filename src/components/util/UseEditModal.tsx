//src/components/util/UseEditModal.tsx
//This is a custom hook that is used to edit the modal
import { useState } from 'react';
import { FoodEntry } from 'prisma/prisma-client';
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

  function openModal(foodEntry : FoodEntry) {
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
