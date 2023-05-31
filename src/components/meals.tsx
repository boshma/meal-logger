//src/components/meals.tsx
// Import necessary dependencies
import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { DeleteButton, EditButton } from "./util/Buttons";
import { LoadingSpinner } from "./loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dispatch, SetStateAction } from 'react';
import React from "react";
import toast from "react-hot-toast";
import { useEditModal } from "./util/UseEditModal";
import { FoodEntry } from "@prisma/client";
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
  const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [fat, setFat] = useState<number | null>(null);



  const ctx = api.useContext();

  const nameInputRef = React.useRef<HTMLInputElement>(null);



  // Define mutation for creating a food entry
  const mutation = api.food.create.useMutation({
    onSuccess: () => {
      // Clear form fields and set success state to true on successful mutation
      setName("");
      setProtein(null);
      setCarbs(null);
      setFat(null);
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
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
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

          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button variant="default" size="sm" type="submit" className="w-32">Add Food</Button>

          )}


        </form>
      </div>

      <div className="pt-2">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            setSelectedDate(date || new Date());
          }}
          customInput={<Button variant="default" size="sm" type="submit">Change date</Button>}
        />
      </div>
    </div>
  );

};

export const MealLog = ({ isLoading: isLoadingProp, selectedDate }: { isLoading: boolean, selectedDate: Date }) => {
  const { data, isLoading } = api.food.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
  });
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const ctx = api.useContext();
  const editModal = useEditModal();

  const deleteMutation = api.food.delete.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been deleted.");
      void ctx.food.getByDate.invalidate()
    },
    onError: (e) => {
      console.error("Failed to delete food entry", e);
    },
    onSettled: (data, error, variables) => {
      const { id } = variables;
      setDeletingIds((currentIds) => currentIds.filter((i) => i !== id));
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleDelete = (id: string) => {
    setDeletingIds((currentIds) => [...currentIds, id]);
    deleteMutation.mutate({ id });
  };

  const SkeletonRow = () => (
    <TableRow>
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
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table >
        <TableHeader >
          <TableRow>
            <TableHead >Food Name</TableHead>
            <TableHead>Protein</TableHead>
            <TableHead>Carbs</TableHead>
            <TableHead>Fat</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((food) => (
            <TableRow key={food.id} >
              <TableCell>{food.name}</TableCell>
              <TableCell>{food.protein}</TableCell>
              <TableCell>{food.carbs}</TableCell>
              <TableCell>{food.fat}</TableCell>
              <TableCell>
                {deletingIds.includes(food.id) ? (
                  <LoadingSpinner size={20} />
                ) : (
                  <><DeleteButton onClick={() => handleDelete(food.id)} /><EditButton onClick={() => editModal.openModal(food)} /></>
                )}
              </TableCell>
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
    </div>
  );
};

export const MealsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <MealForm
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <MealLog isLoading={isLoading} selectedDate={selectedDate} />
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
    <div className = "pb-4">
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

interface EditModalProps {
  foodEntry: FoodEntry | null,
  handleClose: () => void,
}

export const EditModal = ({ foodEntry, handleClose }: EditModalProps) => {
  const [name, setName] = useState(foodEntry?.name || "");
  const [protein, setProtein] = useState<number | null>(foodEntry?.protein || null);
  const [carbs, setCarbs] = useState<number | null>(foodEntry?.carbs || null);
  const [fat, setFat] = useState<number | null>(foodEntry?.fat || null);

  const ctx = api.useContext();

  const updateMutation = api.food.update.useMutation({
    onSuccess: () => {
      toast.success("Your meal has been updated.");
      // Refetch the meal log after successful update
      void ctx.food.getByDate.invalidate()
      handleClose(); // Close modal after successful update
    },
    onError: (e) => {
      console.error("Failed to update food entry", e);
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mutate the food entry
    if (foodEntry) {
      updateMutation.mutate({
        id: foodEntry.id,
        name,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        date: foodEntry.date.toISOString(),
      });
    }
  };

  return (
    // Add classes to position modal center of screen
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2">
        <h1 className="p-4 border-b">Edit Food Entry</h1>
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Food name"
          //ref={nameInputRef}
          />

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

          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Update
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

