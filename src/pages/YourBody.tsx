import React, { useState } from "react";
import Layout from "../components/Layout";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutCharts from "../components/WorkoutCharts";
import Calendar from "../components/Calendar";
import { isSameDay } from "date-fns";
import AddWorkoutButton from "../components/AddWorkoutButton";
import { Dumbbell } from "lucide-react";
import { getProgress, getSelectedUser, getWorkouts } from "@/storage";
import WorkoutNumbers from "@/components/WorkoutNumbers";
import { getValidWorkouts } from "@/functions";
import { get } from "http";
import WeekReview from "@/components/WeekReview";
import moment from "moment";
import TopThree from "@/components/TopThree";
import { fi } from "date-fns/locale";
import SugestedWorkouts from "@/components/SugestedWorkouts";
import ProgressReview from "@/components/ProgressReview";

const YourBody = () => {
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());

  const [progress, setProgress] = useState(getProgress(selectedUser.id));

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Seu progresso</h1>
        </header>

        <ProgressReview progress={progress} />
      </div>
      <AddWorkoutButton />
    </Layout>
  );
};

export default YourBody;
