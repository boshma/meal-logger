//src/components/meal-dashboard/target-macros/set-target-handler.tsx
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";




export const SetTargetMacros = ({ onOpen }: { onOpen: () => void }) => {
  const [open, setOpen] = useState(false);
  const ctx = api.useContext();
  const targetMacrosQuery = api.targetMacros.getTargetMacros.useQuery();


  const handleOpen = () => {
    setOpen(true);
    onOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (targetMacrosQuery.isError || targetMacrosQuery.isSuccess) {
      handleClose();
    }
  }, [targetMacrosQuery.status]);

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
        <Button className="w-full" onClick={handleOpen}>Edit Target Macros</Button>
      </div>
    </div>
  );
};

