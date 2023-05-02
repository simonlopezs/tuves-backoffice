import { LocationOnOutlined, QuestionMark } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { LonLat } from "../../../services/location";

interface StateIconProps {
  location: LonLat;
  size?: "small" | "medium" | "large";
}
type State = "very close" | "near" | "away" | "far away" | "unknown";

const stateColors: Record<
  State,
  "success" | "primary" | "warning" | "error" | "info"
> = {
  "very close": "success",
  near: "primary",
  away: "warning",
  "far away": "error",
  unknown: "info",
};

export const StateIcon = ({ location, size = "medium" }: StateIconProps) => {
  if (!location)
    return (
      <IconButton size={size}>
        <QuestionMark />
      </IconButton>
    );

  const stateColor = stateColors["unknown"];

  return (
    <IconButton color={stateColor}>
      <LocationOnOutlined fontSize={size} />
    </IconButton>
  );
};
