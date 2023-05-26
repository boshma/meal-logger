// src/components/EditModal.tsx
import { Dispatch, SetStateAction, useState } from "react";
import { FoodEntry } from "prisma/prisma-client";
import FloatingOutlinedInput, { FloatingOutlinedInputNumber } from "./util/FloatingOutlinedInput";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

interface EditModalProps {
  foodEntry: FoodEntry | null,
  handleClose: () => void,
}

export const EditModal = ({ foodEntry, handleClose }: EditModalProps) => {
  const [name, setName] = useState(foodEntry?.name || "");
  const [protein, setProtein] = useState<number | null>(foodEntry?.protein || null);
  const [carbs, setCarbs] = useState<number | null>(foodEntry?.carbs || null);
  const [fat, setFat] = useState<number | null>(foodEntry?.fat || null);

  const ctx = api.useContext();

  const updateMutation = api.food.update.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been updated.");
      // Refetch the meal log after successful update
      void ctx.food.getByDate.invalidate()
      handleClose(); // Close modal after successful update
    },
    onError: (e) => {
      console.error("Failed to update food entry", e);
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mutate the food entry
    if (foodEntry) {
      updateMutation.mutate({
        id: foodEntry.id,
        name,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        date: foodEntry.date.toISOString(),
      });
    }
  };




  return (
    // Add classes to position modal center of screen
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2">
        <h1 className="p-4 border-b">Edit Food Entry</h1>
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <FloatingOutlinedInput id="name" value={name} onChange={setName} label="Name" />

          <FloatingOutlinedInputNumber id="protein" value={protein} onChange={setProtein} label="Protein" />
          <FloatingOutlinedInputNumber id="carbs" value={carbs} onChange={setCarbs} label="Carbs" />
          <FloatingOutlinedInputNumber id="fat" value={fat} onChange={setFat} label="Fat" />

          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Update
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};