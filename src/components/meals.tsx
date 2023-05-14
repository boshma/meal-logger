//src/components/meals.tsx
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Alert } from "./alerts";
import FloatingOutlinedInput from "./util/FloatingOutlinedInput";
import SvgButton from "./util/SvgButton";

export const MealForm = ({ selectedDate, refetchMealLog }: { selectedDate: Date, refetchMealLog: () => void }) => {
  const user = useUser();
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // new state variable for tracking success



  const mutation = api.food.create.useMutation({
    onSuccess: () => {
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
      setIsSuccess(true); // set success state to true on successful mutation
      void refetchMealLog(); // refetch the meal log after successful mutation
    },
    onError: (e) => {
      console.error("Failed to create food entry", e);
      setIsSuccess(false); // set success state to false on error
    },
  });

  if (!user) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false); // reset success state before mutation
  
    // Get the timezone offset in minutes
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;
  
    // Create a new date object that includes the timezone offset
    const localISOTime = new Date(selectedDate.getTime() - timezoneOffset);
  
    // Generate dateString using localISOTime
    const dateString = `${localISOTime.getUTCFullYear()}-${String(localISOTime.getUTCMonth() + 1).padStart(2, '0')}-${String(localISOTime.getUTCDate()).padStart(2, '0')}T00:00:00Z`;
  
    if (dateString) {
      mutation.mutate({
        name,
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        date: dateString,
      });
    } else {
      console.error("Failed to create food entry: Date is undefined");
    }
  };
  
  

  return (
    <div>
      {isSuccess && <Alert message="Your meal has been saved." type="success" onClose={() => setIsSuccess(false)} />}
      <form onSubmit={handleSubmit}>
        <FloatingOutlinedInput id="name" value={name} onChange={setName} label="Name" />
        <FloatingOutlinedInput id="protein" value={protein} onChange={setProtein} label="Protein" />
        <FloatingOutlinedInput id="carbs" value={carbs} onChange={setCarbs} label="Carbs" />
        <FloatingOutlinedInput id="fat" value={fat} onChange={setFat} label="Fat" />
        <SvgButton />
      </form>
    </div>
  );
};

export const MealLog = ({ selectedDate }: { selectedDate: Date }) => {
  const { data, isLoading } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
  });

  if (isLoading) {
    return <LoadingPage />; 
  }

  return (
    <div className="flex flex-col items-center">
      {data?.map((food) => (
        <div key={food.id} className="mb-2">
          user: {food.userId} {food.name} fats: {food.fat} carbs: {food.carbs}{" "}
          protein: {food.protein}
        </div>
      ))}
    </div>
  );
};

type FoodData = {
  protein: number;
  carbs: number;
  fat: number;
};

export const MacroSummary = ({ selectedDate }: { selectedDate: Date }) => {
  const { data, isLoading, isError } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
  });

  if (isLoading) {
    return <LoadingPage />; 
  }
  
  if (isError || !data) {
    return <div>Error loading macro summary</div>;
  }

  const totalProtein = data.reduce((total: number, food: FoodData) => total + food.protein, 0);
  const totalCarbs = data.reduce((total: number, food: FoodData) => total + food.carbs, 0);
  const totalFat = data.reduce((total: number, food: FoodData) => total + food.fat, 0);
  const totalCalories = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

  return (
    <div className="macro-summary">
      <div>Total Protein: {totalProtein}</div>
      <div>Total Carbs: {totalCarbs}</div>
      <div>Total Fat: {totalFat}</div>
      <div>Total Calories: {totalCalories}</div>
    </div>
  );
};