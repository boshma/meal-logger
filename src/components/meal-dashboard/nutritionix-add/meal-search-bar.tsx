//src/components/meal-dashboard/nutritionix-add/meal-search-bar.tsx
import { api } from "~/utils/api";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { LoadingPage } from "~/components/ui/loading";
import toast from "react-hot-toast";
import { Input } from "~/components/ui/input";
import { useEditSearchedMealModal } from "~/components/hooks/use-edit-searched-meal-modal";
import { EditSearchedMealModal } from "./edit-nutritionix-meal";

interface SearchedFoodEntry {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
}

export const MealSearchBar = ({ selectedDate }: { selectedDate: Date }) => {
  const [search, setSearch] = useState<string>("");
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<SearchedFoodEntry | null>(null);
  const editModal = useEditSearchedMealModal();

  const {
    data: foodData,
    isLoading,
    error,
    refetch,
  } = api.food.search.useQuery(
    { query: search },
    {
      enabled: false,
      onSuccess: () => {
        setSearchInitiated(false);
      },
      onError: (e) => {
        console.error("Failed to find food in Nutrit. db.", e);
        toast.error(e.message || "Failed to find food in Nutritionix database");
        if (e.message === "No search results found" || e.message === "Food not found") {
          setSearch('');
          setSearchInitiated(false);
        }
      },
    }
  );


  const food: SearchedFoodEntry | null = foodData
    ? {
      id: '',
      name: foodData.name,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      servingSize: 1,
    }
    : null;

  const handleRowClick = (meal: SearchedFoodEntry) => {
    setSelectedFood(meal);
    editModal.openModal(meal);
  };

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === 'Enter' || !e) {
      if (search) {
        setSearchInitiated(true);
        refetch().catch((error) => {
          console.error('Error refetching:', error);
        });
      } else {
        console.error('No search input');
      }
    }
  };



  if (isLoading && searchInitiated) return <LoadingPage />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Input
        type="text"
        placeholder="Search for a meal **Powered By Nutritionix**"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />
      {food && (
        <Card>
          <CardHeader>
            <CardTitle>Search Result</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Name</TableHead>
                  <TableHead>Protein</TableHead>
                  <TableHead>Carbs</TableHead>
                  <TableHead>Fat</TableHead>
                </TableRow>
              </TableHeader>
              <TableRow onClick={() => handleRowClick(food)}>
                <TableCell>{food.name}</TableCell>
                <TableCell>{food.protein}</TableCell>
                <TableCell>{food.carbs}</TableCell>
                <TableCell>{food.fat}</TableCell>
              </TableRow>
            </Table>
          </CardContent>
          <CardFooter>
            Powered by Nutritionix
          </CardFooter>
        </Card>
      )}
      {editModal.isOpen && (
        <EditSearchedMealModal
          searchedMeal={editModal.currentSearchedMeal}
          handleClose={editModal.closeModal}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};