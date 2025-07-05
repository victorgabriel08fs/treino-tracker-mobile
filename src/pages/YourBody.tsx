import React, { useState } from "react";
import Layout from "../components/Layout";
import AddWorkoutButton from "../components/AddWorkoutButton";
import { getProgress, getSelectedUser } from "@/storage";
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
