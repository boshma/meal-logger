// src/components/hooks/use-edit-exercise-modal.tsx

import { useState } from 'react';
import { ExerciseEntry } from "@prisma/client";

export const useEditExerciseModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentExerciseEntry, setCurrentExerciseEntry] = useState<ExerciseEntry | null>(null);

  const openModal = (exercise: ExerciseEntry) => {
    setIsOpen(true);
    setCurrentExerciseEntry(exercise);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentExerciseEntry(null);
  };

  return { isOpen, openModal, closeModal, currentExerciseEntry };
};
