//src/components/meal-dashboard/meal-page-layout.tsx
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MealForm } from "./quick-add/meal-form";
import { MealLog } from "./meal-log/meal-log";
import { FoodCollection } from "./saved-meals/food-collection";
import { MealSearchBar } from "./nutritionix-add/meal-search-bar";
import { SavedMealFormDialog } from "./saved-meals/add-food-to-collection";
import { MacroSummary } from "./macro-summary";
import { MacroTargetBanner } from "./target-macros/target-banner";


export const MealsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="flex justify-center space-x-10 w-full max-w-screen-lg mx-auto pb-4">
        <Tabs defaultValue="mealform" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mealform">Quick add</TabsTrigger>
            <TabsTrigger value="foodcollection">Add from collection</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          <TabsContent value="mealform">
            <MealForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="foodcollection">
            <FoodCollection isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedDate={selectedDate} />
          </TabsContent>

          <TabsContent value="search">
            <MealSearchBar selectedDate={selectedDate} />
          </TabsContent>
        </Tabs>

      </div>
      <div className="w-full">
        <MealLog isLoading={isLoading} selectedDate={selectedDate} />
      </div>
      <SavedMealFormDialog open={isModalOpen} handleClose={() => setIsModalOpen(false)} />
    </>
  );
};








