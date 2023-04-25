import {
  CheckCircleOutline,
  ErrorOutline,
  QuestionMark,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface StateIconProps {
  daysLate: number | null;
}

type State = "ok" | "warning" | "error";

const states: Record<
  State,
  { icon: JSX.Element; color: "success" | "warning" | "error" }
> = {
  ok: {
    icon: <CheckCircleOutline />,
    color: "success",
  },
  warning: {
    icon: <ErrorOutline />,
    color: "warning",
  },
  error: {
    icon: <ErrorOutline />,
    color: "error",
  },
};

export const StateIcon = ({ daysLate }: StateIconProps) => {
  if (!daysLate)
    return (
      <IconButton>
        <QuestionMark />
      </IconButton>
    );

  const state: State =
    daysLate <= 0 ? "ok" : daysLate <= 30 ? "warning" : "error";
  const stateData = states[state];
  return (
    <IconButton aria-label={state} color={stateData.color}>
      {stateData.icon}
    </IconButton>
  );
};
