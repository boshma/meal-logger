// src/pages/exercise/[slug].tsx
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { ExerciseForm } from "~/components/exercise-dashboard/add-exercise";
import { ExerciseLog } from "~/components/exercise-dashboard/exercise-log";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExercisePage: NextPage = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  // State variables required for ExerciseForm
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>TrackFit</title>
        <meta name="description" content="Profile Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col h-screen items-center justify-start">
        {!!user && <Navbar />}
        <div className="w-full max-w-3xl mx-auto mt-4 p-4"> 
          <div className="text-center mb-4">
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
          <ExerciseForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <ExerciseLog isLoading={isLoading} selectedDate={selectedDate} />
        </div> {/* Close wrapper div */}
      </main>
    </>
  );
};

export default ExercisePage;
