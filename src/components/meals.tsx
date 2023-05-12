import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export const MealForm = ({ selectedDate, refetchMealLog }: { selectedDate: Date, refetchMealLog: () => void }) => {
  const user = useUser();
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");


  const mutation = api.food.create.useMutation({
    onSuccess: () => {
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
      void refetchMealLog(); // refetch the meal log after successful mutation
    },
    onError: (e) => {
      console.error("Failed to create food entry", e);
    },
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="protein"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
      />
      <input
        placeholder="carbs"
        value={carbs}
        onChange={(e) => setCarbs(e.target.value)}
      />
      <input
        placeholder="fat"
        value={fat}
        onChange={(e) => setFat(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
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