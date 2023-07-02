//src/components/hooks/UseEditModal.tsx
import { FoodEntry } from 'prisma/prisma-client';
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";


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
