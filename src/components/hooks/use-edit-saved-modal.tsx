//src/components/hooks/use-edit-saved-modal.tsx
import { useState } from 'react';
import { SavedMeal } from 'prisma/prisma-client';
import "react-datepicker/dist/react-datepicker.css";



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