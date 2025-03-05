
import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddWorkoutButton = () => {
  return (
    <Link
      to="/new"
      className="fixed right-6 bottom-20 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-200 z-50"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
};

export default AddWorkoutButton;
