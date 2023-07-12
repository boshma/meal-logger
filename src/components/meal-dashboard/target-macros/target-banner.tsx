//src/components/meal-dashboard/target-macros/target-banner.tsx
import { api } from "~/utils/api";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";



export const MacroTargetBanner = () => {
  const targetMacrosQuery = api.targetMacros.getTargetMacros.useQuery();


  return (
    <div className="flex justify-between items-center">
      <div>
        {targetMacrosQuery.data?.isSet === false ? (
          <p>No target macros set</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Current Target Macros</h2>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span>Protein</span>
                <span>{targetMacrosQuery.data?.protein || 0}g</span>
                <span>Carbs</span>
                <span>{targetMacrosQuery.data?.carbs || 0}g</span>
                <span>Fat</span>
                <span>{targetMacrosQuery.data?.fat || 0}g</span>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};
