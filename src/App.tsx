import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { WorkoutProvider } from "./context/WorkoutContext"; // Importe o contexto
import Index from "./pages/Index";
import WorkoutDetail from "./pages/WorkoutDetail";
import NewWorkout from "./pages/NewWorkout";
import WorkoutHistory from "./pages/WorkoutHistory";
import NotFound from "./pages/NotFound";
import EditWorkout from "./pages/EditWorkout";
import Profile from "./pages/Profile";
import { getSelectedUser, getUsers, setSelectedUser } from "./storage";
import CreateUser from "./pages/CreateUser";
import api from "./api";
import { fixMuscleGroups, muscleGroupMigration } from "./functions";

const queryClient = new QueryClient();

const App = () => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    handleTestApi();
    fixMuscleGroups();
    if (!getSelectedUser()) {
      if (getUsers().length > 0) setSelectedUser(getUsers()[0].id);
    }
  }, []);

  const handleTestApi = async () => {
    try {
      await api.get("/").then((res) => console.log(res.data)).catch((err) => console.log(err));
      
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <WorkoutProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {!getSelectedUser() ? (
                  <Route path="/" element={<CreateUser key={`create-${key}`} />} />
                ) : (
                  <>
                    <Route path="/" element={<Index key={`index-${key}`} />} />
                    <Route
                      path="/workout/:id"
                      element={<WorkoutDetail key={`detail-${key}`} />}
                    />
                    <Route
                      path="/workout/:id/edit"
                      element={<EditWorkout key={`edit-${key}`} />}
                    />
                    <Route
                      path="/new"
                      element={<NewWorkout key={`new-${key}`} />}
                    />
                    <Route
                      path="/history"
                      element={<WorkoutHistory key={`history-${key}`} />}
                    />
                    <Route
                      path="/profile"
                      element={<Profile key={`profile-${key}`} />}
                    />
                  </>
                )}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </WorkoutProvider>
    </>
  );
};

export default App;
