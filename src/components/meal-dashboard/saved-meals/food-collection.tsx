//src/components/meal-dashboard/saved-meals/food-collection.tsx
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import "react-datepicker/dist/react-datepicker.css";
import { Dispatch, SetStateAction } from 'react';
import React from "react";
import { Button } from "../../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { LoadingPage } from "~/components/ui/loading";
import { SavedMeal } from "@prisma/client";
import { EditSavedMealModal } from "./edit-saved-meal";
import { useEditSavedMealModal } from "~/components/hooks/use-edit-saved-modal";


export const FoodCollection = ({ isModalOpen, setIsModalOpen, selectedDate }: { isModalOpen: boolean, setIsModalOpen: Dispatch<SetStateAction<boolean>>, selectedDate: Date }) => {
  const user = useUser();

  const { data, isLoading } = api.foodCollection.getSavedMeals.useQuery({
    userId: user.user?.id || "",
  });

  const editModal = useEditSavedMealModal();

  const handleRowClick = (meal: SavedMeal) => {
    editModal.openModal(meal);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Card className="max-w-xl mx-auto overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">My Food Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-52 w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Name</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Carbs</TableHead>
                <TableHead>Fat</TableHead>
              </TableRow>
            </TableHeader>
            {data?.map((meal) => (
              <TableRow key={meal.id} onClick={() => handleRowClick(meal)}>
                <TableCell>{meal.name}</TableCell>
                <TableCell>{meal.protein}</TableCell>
                <TableCell>{meal.carbs}</TableCell>
                <TableCell>{meal.fat}</TableCell>
              </TableRow>
            ))}
          </Table>
          {editModal.isOpen && (
            <EditSavedMealModal
              savedMeal={editModal.currentSavedMeal}
              handleClose={() => {
                editModal.closeModal();
              }}
              selectedDate={selectedDate}
            />
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => setIsModalOpen(true)}>Add new food to my Collection</Button>
      </CardFooter>
    </Card>
  );
};