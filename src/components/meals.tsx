//src/components/meals.tsx
// Import necessary dependencies
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Alert } from "./alerts";
import FloatingOutlinedInput from "./util/FloatingOutlinedInput";
import {SvgButton} from "./util/SvgButton";

// Component for creating a meal form
export const MealForm = ({ selectedDate, refetchMealLog }: { selectedDate: Date, refetchMealLog: () => void }) => {
  // Get the current user
  const user = useUser();
  // Initialize state for form fields and success state
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); 

  // Define mutation for creating a food entry
  const mutation = api.food.create.useMutation({
    onSuccess: () => {
      // Clear form fields and set success state to true on successful mutation
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
  
  // Define the form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false); // reset success state before mutation
  
    // Get the timezone offset in minutes
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;
  
    // Create a new date object that includes the timezone offset
    const localISOTime = new Date(selectedDate.getTime() - timezoneOffset);
  
    // Generate dateString using localISOTime
    const dateString = `${localISOTime.getUTCFullYear()}-${String(localISOTime.getUTCMonth() + 1).padStart(2, '0')}-${String(localISOTime.getUTCDate()).padStart(2, '0')}T00:00:00Z`;
  
    // Attempt to create a food entry with the form values
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
  
  // Return the form
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

// Component for displaying a meal log
export const MealLog = ({ selectedDate }: { selectedDate: Date }) => {
  // Fetch meal data for the selected date
  const { data, isLoading } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
  });

  // Show loading state while data is fetching
  if (isLoading) {
    return <LoadingPage />; 
  }

  // Return the list of meals
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

// Define the type of food data
type FoodData = {
  protein: number;
  carbs: number;
  fat: number;
};

// Component for displaying a summary of macros
export const MacroSummary = ({ selectedDate }: { selectedDate: Date }) => {
  // Fetch food data for the selected date
  const { data, isLoading, isError } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
  });

  // Show loading state while data is fetching
  if (isLoading) {
    return <LoadingPage />; 
  }
  
  // Handle error state
  if (isError || !data) {
    return <div>Error loading macro summary</div>;
  }

  // Calculate total protein, carbs, fat and calories
  const totalProtein = data.reduce((total: number, food: FoodData) => total + food.protein, 0);
  const totalCarbs = data.reduce((total: number, food: FoodData) => total + food.carbs, 0);
  const totalFat = data.reduce((total: number, food: FoodData) => total + food.fat, 0);
  const totalCalories = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

  // Return the macro summary
  return (
    <div className="macro-summary">
      <div>Total Protein: {totalProtein}</div>
      <div>Total Carbs: {totalCarbs}</div>
      <div>Total Fat: {totalFat}</div>
      <div>Total Calories: {totalCalories}</div>
    </div>
  );
};

