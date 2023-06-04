//src/components/macroTargets.tsx
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Input } from "./input";
import { Button } from "./button";

const SetTargetMacros = () => {
  const user = useUser();
   const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [fat, setFat] = useState<number | null>(null);
  const ctx = api.useContext();

  // Define mutation for setting target macros
  const mutation = api.food.setTargetMacros.useMutation({
    onSuccess: () => {
      toast.success("Your target macros have been set.");
      void ctx.food.getTargetMacros.invalidate();
    },
    onError: (e) => {
      console.error("Failed to set target macros", e);
      toast.error("Failed to set target macros, please try again later!");
    },
  });

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

  return (
    <div className="flex justify-between items-center">
    <form onSubmit={handleSubmit} className="space-y-2">
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
      <Button type="submit" className="w-full">Set Target Macros</Button>
    </form>
    </div>
  );
};

export default SetTargetMacros;