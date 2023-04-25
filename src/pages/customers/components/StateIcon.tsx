import {
  CheckCircleOutline,
  ErrorOutline,
  QuestionMark,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface StateIconProps {
  daysLate: number | null;
  size?: "small" | "medium" | "large";
}

type State = "ok" | "warning" | "error";

const states: Record<
  State,
  {
    icon: (size: "small" | "medium" | "large") => JSX.Element;
    color: "success" | "warning" | "error";
  }
> = {
  ok: {
    icon: (size) => <CheckCircleOutline fontSize={size} />,
    color: "success",
  },
  warning: {
    icon: (size) => <ErrorOutline fontSize={size} />,
    color: "warning",
  },
  error: {
    icon: (size) => <ErrorOutline fontSize={size} />,
    color: "error",
  },
};

export const StateIcon = ({ daysLate, size = "medium" }: StateIconProps) => {
  if (!daysLate)
    return (
      <IconButton size={size}>
        <QuestionMark />
      </IconButton>
    );

  const state: State =
    daysLate <= 0 ? "ok" : daysLate <= 30 ? "warning" : "error";
  const stateData = states[state];
  return (
    <IconButton aria-label={state} color={stateData.color}>
      {stateData.icon(size)}
    </IconButton>
  );
};
