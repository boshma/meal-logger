//src/components/meals.tsx
// Import necessary dependencies
import { api } from "~/utils/api";
import { useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import { FoodEntry } from "@prisma/client";
import { LoadingPage } from "~/components/ui/loading";

import { Skeleton } from "~/components/ui/skeleton";
import { TableRow, TableCell, TableHeader, TableHead, TableBody, Table } from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { EditModal } from "./edit-meal-in-log";
import { useEditModal } from "~/components/hooks/use-edit-modal";
import { useUser } from "@clerk/nextjs";



export const MealLog = ({ isLoading: isLoadingProp, selectedDate }: { isLoading: boolean, selectedDate: Date }) => {
  const user = useUser();
  const { data, isLoading } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
    userId: user.user?.id || "",
  });

  const originalProtein = useRef<number>(0);
  const originalCarbs = useRef<number>(0);
  const originalFat = useRef<number>(0);

  const editModal = useEditModal();

  const handleRowClick = (food: FoodEntry) => {
    originalProtein.current = food.protein / food.servingSize;
    originalCarbs.current = food.carbs / food.servingSize;
    originalFat.current = food.fat / food.servingSize;
    editModal.openModal(food);
  };


  if (isLoading) {
    return <LoadingPage />;
  }

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Log for {selectedDate.toDateString()}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-80">
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead>Food Name</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Carbs</TableHead>
                <TableHead>Fat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((food) => (
                <TableRow key={food.id} onClick={() => handleRowClick(food)}>
                  <TableCell>{food.name}</TableCell>
                  <TableCell>{food.protein}</TableCell>
                  <TableCell>{food.carbs}</TableCell>
                  <TableCell>{food.fat}</TableCell>
                </TableRow>
              ))}
              {isLoadingProp && <SkeletonRow />}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      {editModal.isOpen && (
        <EditModal
          foodEntry={editModal.currentFoodEntry}
          handleClose={() => {
            editModal.closeModal();
          }}
          originalProtein={originalProtein}
          originalCarbs={originalCarbs}
          originalFat={originalFat}
        />
      )}
    </Card>
  );
};
