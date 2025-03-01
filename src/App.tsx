
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkoutDetail from "./pages/WorkoutDetail";
import NewWorkout from "./pages/NewWorkout";
import WorkoutHistory from "./pages/WorkoutHistory";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [key, setKey] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index key={`index-${key}`} />} />
            <Route path="/workout/:id" element={<WorkoutDetail key={`detail-${key}`} />} />
            <Route path="/new" element={<NewWorkout key={`new-${key}`} />} />
            <Route path="/history" element={<WorkoutHistory key={`history-${key}`} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
