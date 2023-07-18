// src/components/exercise-dashboard/quick-add/exercise-form.tsx
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Dispatch, SetStateAction } from 'react';
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button, ButtonLoading } from "../ui/button";

export const ExerciseForm = ({
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
  const [weight, setWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");

  const ctx = api.useContext();

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Define mutation for creating an exercise entry
  const mutation = api.exerciseLog.create.useMutation({
    onSuccess: () => {
      // Clear form fields and set success state to true on successful mutation
      setName("");
      setWeight("");
      toast.success("Your exercise has been logged.");
      void ctx.exerciseLog.getByDate.invalidate()
      // Focus the name input field
      nameInputRef.current?.focus();
      setIsLoading(false);
    },
    onError: (e) => {
      console.error("Failed to log exercise", e);
      toast.error("Failed to log exercise, please try again later!");
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

    // Attempt to create an exercise entry with the form values
    if (dateString) {
      setIsLoading(true);
      mutation.mutate({
        name,
        weight: parseFloat(weight) || 0,
        date: dateString,
        reps: parseInt(reps) || 0,
      });
    } else {
      console.error("Failed to log exercise: Date is undefined");
    }
  };

  // Return the form
  return (
    <Card className="w-full flex flex-col items-center space-y-4">
      <CardHeader>
        <CardTitle className="text-center">Log New Exercise</CardTitle>
        <CardDescription>
          Provide the exercise name and the weight you lifted.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            label="Name"
            placeholder="Exercise name"
            ref={nameInputRef}
          />
          <Input
            id="reps"
            value={reps}
            onChange={e => setReps(e.target.value)}
            label="Reps"
            placeholder="Reps"
            numeric
          />
          <Input
            id="weight"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            label="Weight"
            placeholder="Weight lifted"
            numeric
          />
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button variant="default" size="sm" type="submit" className="w-full">Quick Log</Button>
          )}
        </form>
      </CardContent>
      <CardFooter>
        Quick log exercise to daily total
      </CardFooter>
    </Card>
  );
};
