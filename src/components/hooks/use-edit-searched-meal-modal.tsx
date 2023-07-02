//src/components/hooks/UseEditSearchedMealModal.tsx

import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

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


