//src/components/util/UseEditModal.tsx
//This is a custom hook that is used to edit the modal
import { useState } from 'react';
import { FoodEntry } from 'prisma/prisma-client';

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
