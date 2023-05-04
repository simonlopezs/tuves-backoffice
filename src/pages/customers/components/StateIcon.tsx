import {
  CheckCircleOutline,
  ErrorOutline,
  QuestionMark,
} from "@mui/icons-material";

interface StateIconProps {
  daysLate: number | null;
  size?: "small" | "medium" | "large";
}

type State = "ok" | "warning" | "error";

const states: Record<
  State,
  (size: "small" | "medium" | "large") => JSX.Element
> = {
  ok: (size) => <CheckCircleOutline color="success" fontSize={size} />,
  warning: (size) => <ErrorOutline color="warning" fontSize={size} />,
  error: (size) => <ErrorOutline color="error" fontSize={size} />,
};

export const StateIcon = ({ daysLate, size = "large" }: StateIconProps) => {
  if (!daysLate) return <QuestionMark fontSize={size} />;

  const state: State =
    daysLate <= 0 ? "ok" : daysLate <= 30 ? "warning" : "error";
  return states[state](size);
};
