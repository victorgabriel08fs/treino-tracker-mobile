import { BicepsFlexed, Dumbbell, LucideApple } from "lucide-react";
import { FaPersonRunning } from "react-icons/fa6";

interface WorkoutIconProps {
  type: string;
}
export const WorkoutIcon = ({ type }: WorkoutIconProps) => {
  let icon = <LucideApple className="h-5 w-5" />;
  switch (type) {
    case "Força":
      icon = <Dumbbell className="h-5 w-5 text-primary" />;
      break;
    case "Hipertrofia":
      icon = <BicepsFlexed className="h-5 w-5 text-red-600" />;
      break;
    case "Resistência":
      icon = <FaPersonRunning className="h-5 w-5 text-yellow-500" />;
      break;
    case "Funcional":
      icon = <FaPersonRunning className="h-5 w-5 text-primary" />;
      break;
  }

  return icon;
};
