import { LocationOnOutlined, QuestionMark } from "@mui/icons-material";

interface StateIconProps {
  distance: number | null;
  size?: "small" | "medium" | "large";
}
type Color = "success" | "primary" | "warning" | "error" | "info";

export const StateIcon = ({ distance, size = "medium" }: StateIconProps) => {
  if (!distance) return <QuestionMark fontSize={size} />;
  const stateColor = getStateColor(distance);

  return <LocationOnOutlined color={stateColor} fontSize={size} />;
};

const getStateColor = (distance: number): Color => {
  if (distance < 1) return "success";
  if (distance < 5) return "primary";
  if (distance < 30) return "warning";
  return "error";
};
