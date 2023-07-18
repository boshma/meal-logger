//src/components/excercise-dashboard/edit-exercise-in-log.tsx
// src/components/exercise-dashboard/edit-exercise-modal.tsx
import { ExerciseEntry } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

interface EditExerciseModalProps {
  exerciseEntry: ExerciseEntry | null;
  handleClose: () => void;
  originalWeight: React.RefObject<number>;
}

export const EditExerciseModal = ({
  exerciseEntry,
  handleClose,
  originalWeight,
}: EditExerciseModalProps) => {
  const [name, setName] = useState(exerciseEntry?.name || "");
  const [weight, setWeight] = useState<string>(exerciseEntry?.weight?.toString() || "0");
  const [reps, setReps] = useState<string>(exerciseEntry?.reps?.toString() || "0");

  const [origWeight, setOrigWeight] = useState(originalWeight.current);

  useEffect(() => {
    if (exerciseEntry) {
      setOrigWeight(originalWeight.current);
      setWeight(exerciseEntry.weight.toString());
    }
  }, [exerciseEntry, originalWeight.current]);

  const ctx = api.useContext();
  if (!exerciseEntry) return null;

  const updateMutation = api.exerciseLog.update.useMutation({
    onSuccess: () => {
      toast.success("Your exercise has been updated.");
      void ctx.exerciseLog.getByDate.invalidate()
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to update exercise entry", e);
    },
  });

  const deleteMutation = api.exerciseLog.delete.useMutation({
    onSuccess: () => {
      toast.success("Your exercise has been deleted.");
      void ctx.exerciseLog.getByDate.invalidate()
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to delete exercise entry", e);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseEntry) {
      updateMutation.mutate({
        id: exerciseEntry.id,
        name,
        weight: parseFloat(weight) || 0,
        date: exerciseEntry.date.toISOString(),
        reps: parseInt(reps) || 0,
      });
    }
  };

  return (
    <Dialog open={!!exerciseEntry}>
      <DialogContent handleClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Edit Exercise Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Exercise name"
          />

          <Input
            id="weight"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            label="Weight"
            placeholder="Weight"
            numeric
          />
          <Input
            id="reps"
            value={reps}
            onChange={e => setReps(e.target.value)}
            label="Reps"
            placeholder="Reps"
            numeric
          />

          <DialogFooter>
            <Button type="submit" >
              Update
            </Button>
            <Button onClick={(e) => {
              e.preventDefault();
              deleteMutation.mutate({ id: exerciseEntry.id });
            }}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
