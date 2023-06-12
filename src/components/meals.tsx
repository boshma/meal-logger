//src/components/meals.tsx
// Import necessary dependencies
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dispatch, SetStateAction } from 'react';
import React from "react";
import toast from "react-hot-toast";
import { EditModal, EditSavedMealModal, useEditModal, useEditSavedMealModal } from "./util/UseEditModal";
import { FoodEntry, SavedMeal } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table';
import { Button, ButtonLoading } from "./button";
import { Input } from "./input";
import { Skeleton } from "./skeleton";
import { ScrollArea } from "./scroll-area";
import { MacroTargetBanner } from "./targets";




// Component for creating a meal form
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



  const ctx = api.useContext();

  const nameInputRef = React.useRef<HTMLInputElement>(null);



  // Define mutation for creating a food entry
  const mutation = api.food.create.useMutation({
    onSuccess: () => {
      // Clear form fields and set success state to true on successful mutation
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
      toast.success("Your meal has been saved.");
      void ctx.food.getByDate.invalidate()
      // Focus the name input field
      nameInputRef.current?.focus();
      setIsLoading(false);
    },
    onError: (e) => {
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
        date: dateString,
      });

    } else {
      console.error("Failed to create food entry: Date is undefined");
    }
  };

  // Return the form
  return (
    <div>
      <div className="flex justify-between items-center">
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
      </div>
      <div className="pt-2">
      </div>
    </div>
  );

};

export const MealLog = ({ isLoading: isLoadingProp, selectedDate }: { isLoading: boolean, selectedDate: Date }) => {
  const { data, isLoading } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
  });
  const editModal = useEditModal();


  if (isLoading) {
    return <LoadingPage />;
  }

  const handleRowClick = (food: FoodEntry) => {
    editModal.openModal(food);
  };

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
    <ScrollArea className="h-52 w-full rounded-md border">
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead >Food Name</TableHead>
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
      {editModal.isOpen && (
        <EditModal
          foodEntry={editModal.currentFoodEntry}
          handleClose={() => {
            editModal.closeModal();
          }}
        />
      )}
    </ScrollArea>
  );
};

export const MealsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <div className="flex flex-col items-center mb-2">

        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              setSelectedDate(date || new Date());
            }}
            customInput={<Button variant="outline" size="sm" type="submit">
              <div className="text-xl font-bold">
                Selected Date: {new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
              </div>
            </Button>}
          />
        </div>
        <MacroTargetBanner />
      </div>

      <MacroSummary selectedDate={selectedDate} />
      <div className="flex justify-center space-x-10">
        <MealForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <MealLog isLoading={isLoading} selectedDate={selectedDate} />
      </div>

      <div className="flex justify-center space-x-10 mt-10">
        <SavedMealForm />
        <FoodCollection selectedDate={selectedDate} />
      </div>

    </>
  );
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

export const FoodCollection = ({ selectedDate }: { selectedDate: Date }) => {
  const user = useUser();

  const { data, isLoading } = api.food.getSavedMeals.useQuery({
    userId: user.user?.id || "",
  });

  const editModal = useEditSavedMealModal();

  const handleRowClick = (meal: SavedMeal) => {
    editModal.openModal(meal);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
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

    </>
  ); 
};


export const SavedMealForm = () => {
  
  const user = useUser();

  const [name, setName] = useState("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const ctx = api.useContext();

  const mutation = api.food.createSavedMeal.useMutation({
    onSuccess: () => {
      toast.success("Saved meal created");
      void ctx.food.getSavedMeals.invalidate()
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
    },
    onError: (e) => {
      toast.error("Failed to create saved meal");
      console.error("Failed to create saved meal", e);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      userId: user.user?.id || "",
      data: {
        name,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        id="name"
        value={name}
        onChange={e => setName(e.target.value)}
        label="Name"
        placeholder="Food name"
      />
      <Input
        id="protein"
        value={protein}
        onChange={e => setProtein(e.target.value)}
        label="Protein"
        placeholder="Protein"
        numeric
      />
      <Input
        id="carbs"
        value={carbs}
        onChange={e => setCarbs(e.target.value)}
        label="Carbs"
        placeholder="Carbs"
        numeric
      />
      <Input
        id="fat"
        value={fat}
        onChange={e => setFat(e.target.value)}
        label="Fat"
        placeholder="Fat"
        numeric
      />
      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? <ButtonLoading /> : "Save Food"}
      </Button>
    </form>
  );
};
