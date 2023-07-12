//src/components/meal-dashboard/target-macros/set-target-dialog.tsx
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";




export const TargetMacrosDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  const user = useUser();
  const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [fat, setFat] = useState<number | null>(null);
  const ctx = api.useContext();

  const targetMacrosQuery = api.targetMacros.getTargetMacros.useQuery();

  useEffect(() => {
    if (targetMacrosQuery.data) {
      setProtein(targetMacrosQuery.data.protein || 0);
      setCarbs(targetMacrosQuery.data.carbs || 0);
      setFat(targetMacrosQuery.data.fat || 0);
    }
  }, [targetMacrosQuery.data]);

  // Define mutation for setting target macros
  const mutation = api.targetMacros.setTargetMacros.useMutation({
    onSuccess: () => {
      toast.success("Your target macros have been set.");
      void ctx.targetMacros.getTargetMacros.invalidate();
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to set target macros", e);
      toast.error("Failed to set target macros, please try again later!");
    },
  });

  // Define mutation for removing target macros
  const removeMutation = api.targetMacros.removeTargetMacros.useMutation({
    onSuccess: () => {
      toast.success("Your target macros have been removed.");
      void ctx.targetMacros.getTargetMacros.invalidate();
      handleClose();
    },
    onError: (e) => {
      console.error("Failed to remove target macros", e);
      toast.error("Failed to remove target macros, please try again later!");
    },
  });

  // Handle deletion
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    // Mutate the target macros
    removeMutation.mutate();
  };

  if (!user) return null;

  // Define the form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Attempt to set target macros with the form values
    mutation.mutate({
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
    });
  };

  // Return the form in a dialog
  return (
    <Dialog open={open}>
      <DialogContent handleClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Set Target Macros</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <Input
            id="protein"
            value={protein === null ? '' : protein}
            onChange={e => setProtein(e.target.value === '' ? null : parseFloat(e.target.value))}
            label="Protein"
            placeholder="Protein"
            numeric
          />
          <Input
            id="carbs"
            value={carbs === null ? '' : carbs}
            onChange={e => setCarbs(e.target.value === '' ? null : parseFloat(e.target.value))}
            label="Carbs"
            numeric
            placeholder="Carbs"
          />
          <Input
            id="fat"
            value={fat === null ? '' : fat}
            onChange={e => setFat(e.target.value === '' ? null : parseFloat(e.target.value))}
            label="Fat"
            numeric
            placeholder="Fat"
          />
          <DialogFooter>
            <Button type="submit">
              Set
            </Button>
            <Button onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}