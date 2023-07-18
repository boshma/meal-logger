//src/components/exercise-dashboard/exercise-log.tsx

import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { LoadingPage } from "~/components/ui/loading";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TableRow, TableCell, TableHeader, TableHead, TableBody, Table } from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ExerciseEntry } from "@prisma/client";
import { useRef } from "react";
import { useEditExerciseModal } from "../hooks/use-exercise-modal";
import { EditExerciseModal } from "./edit-exercise-in-log";

export const ExerciseLog = ({ isLoading: isLoadingProp, selectedDate }: { isLoading: boolean, selectedDate: Date }) => {
  const user = useUser();
  const { data, isLoading } = api.exerciseLog.getByDate.useQuery({
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
    userId: user.user?.id || "",
  });

  const originalWeight = useRef<number>(0);

  const editExerciseModal = useEditExerciseModal();

  const handleRowClick = (exercise: ExerciseEntry) => {
    originalWeight.current = exercise.weight;
    editExerciseModal.openModal(exercise);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Log for {selectedDate.toDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full h-80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise Name</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((exercise) => (
                <TableRow key={exercise.id} onClick={() => handleRowClick(exercise)}>
                  <TableCell>{exercise.name}</TableCell>
                  <TableCell>{exercise.reps}</TableCell>
                  <TableCell>{exercise.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      {editExerciseModal.isOpen && (
        <EditExerciseModal
          exerciseEntry={editExerciseModal.currentExerciseEntry}
          handleClose={() => {
            editExerciseModal.closeModal();
          }}
          originalWeight={originalWeight}
        />
      )}
    </Card>
  );
};
