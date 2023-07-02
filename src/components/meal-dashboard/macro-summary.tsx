//src/components/meal-dashboard/MacroSummary.tsx
import { api } from "~/utils/api";
import { LoadingPage } from "../ui/loading";
import { FoodEntry } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
  const totalProtein = data.reduce((total: number, food: FoodEntry) => total + food.protein, 0);
  const totalCarbs = data.reduce((total: number, food: FoodEntry) => total + food.carbs, 0);
  const totalFat = data.reduce((total: number, food: FoodEntry) => total + food.fat, 0);
  const totalCalories = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

  // Return the macro summary
  return (
    <div className="pb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead >Total Protein</TableHead>
            <TableHead>Total Carbs</TableHead>
            <TableHead>Total Fats</TableHead>
            <TableHead>Total Calories</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{totalProtein}</TableCell>
            <TableCell>{totalCarbs}</TableCell>
            <TableCell>{totalFat}</TableCell>
            <TableCell>{totalCalories}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </div>

  );
};