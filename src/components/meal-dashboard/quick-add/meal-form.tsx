//src/components/meal-dashboard/quick-add/meal-form.tsx
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Dispatch, SetStateAction } from 'react';
import React from "react";
import toast from "react-hot-toast";
import { Button, ButtonLoading } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../ui/card";



export const MealForm = ({
  isLoading,
  setIsLoading,
  selectedDate,
  setSelectedDate,
}: {
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  selectedDate: Date,
  setSelectedDate: Dispatch<SetStateAction<Date>>,
}) => {
  // Get the current user
  const user = useUser();
  // Initialize state for form fields 
  const [name, setName] = useState("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [servingSize, setServingSize] = useState<string>("1");



  const ctx = api.useContext();

  const nameInputRef = React.useRef<HTMLInputElement>(null);



  // Define mutation for creating a food entry
  const mutation = api.mealLog.create.useMutation({
    onSuccess: () => {
      // Clear form fields and set success state to true on successful mutation
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
      toast.success("Your meal has been saved.");
      void ctx.mealLog.getByDate.invalidate()
      // Focus the name input field
      nameInputRef.current?.focus();
      setIsLoading(false);
    }, onError: (e) => {
      console.error("Failed to create food entry", e);
      toast.error("Failed to create food entry, please try again later!");
      setIsLoading(false);
    },

  });

  if (!user) return null;

  // Define the form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the timezone offset in minutes
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;

    // Create a new date object that includes the timezone offset
    const localISOTime = new Date(selectedDate.getTime() - timezoneOffset);

    // Generate dateString using localISOTime
    const dateString = `${localISOTime.getUTCFullYear()}-${String(localISOTime.getUTCMonth() + 1).padStart(2, '0')}-${String(localISOTime.getUTCDate()).padStart(2, '0')}T00:00:00Z`;

    // Attempt to create a food entry with the form values
    if (dateString) {
      setIsLoading(true);
      mutation.mutate({
        name,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        servingSize: parseFloat(servingSize) || 1,
        date: dateString,
      });

    } else {
      console.error("Failed to create food entry: Date is undefined");
    }
  };

  // Return the form
  return (
    <Card className="w-full flex flex-col items-center space-y-4">
      <CardHeader>
        <CardTitle className="text-center">Add New Meal</CardTitle>
        <CardDescription>
          Provide the food name and its macro nutrient details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Food name"
            ref={nameInputRef}
          />
          <Input
            id="protein"
            value={protein}
            onChange={e => {
              const val = e.target.value;
              setProtein(val)
            }}
            label="Protein"
            placeholder="Protein"
            numeric
          />
          <Input
            id="carbs"
            value={carbs}
            onChange={e => {
              const val = e.target.value;
              setCarbs(val)
            }}
            label="Carbs"
            placeholder="Carbs"
            numeric
          />
          <Input
            id="fat"
            value={fat}
            onChange={e => {
              const val = e.target.value;
              setFat(val)
            }}
            label="Fat"
            placeholder="Fat"
            numeric
          />
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button variant="default" size="sm" type="submit" className="w-full">Quick Add</Button>

          )}
        </form>
      </CardContent>
      <CardFooter>
        quick add meal to daily total
      </CardFooter>
    </Card>
  );
};