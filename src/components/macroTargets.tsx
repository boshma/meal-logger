//src/components/macroTargets.tsx
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Input } from "./input";
import { Button } from "./button";

const SetTargetMacros = () => {
  const user = useUser();
  const [targetMacros, setTargetMacros] = useState(null);
  const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [fat, setFat] = useState<number | null>(null);
  const ctx = api.useContext();

  const targetMacrosQuery = api.food.getTargetMacros.useQuery();

  useEffect(() => {
    const { data: currentTargetMacros } = targetMacrosQuery;
    setProtein(currentTargetMacros?.protein || 0);
    setCarbs(currentTargetMacros?.carbs || 0);
    setFat(currentTargetMacros?.fat || 0);
  }, []);

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
      <div>
        <h2 className="text-2xl font-bold">Current Target Macros</h2>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span>Protein</span>
            <span>{targetMacrosQuery.data?.protein || 0}g</span>
            <span>{targetMacrosQuery.data?.carbs || 0}g</span>
            <span>{targetMacrosQuery.data?.fat || 0}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetTargetMacros;