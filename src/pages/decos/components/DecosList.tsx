import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { orderBy } from "lodash";
import { Router as RouterIcon } from "@mui/icons-material";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

interface DecosListProps {
  decos: any[];
}

export const DecosList = ({ decos }: DecosListProps) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const togglePanel = () => setExpanded((expanded) => !expanded);

  return (
    <div>
      <Accordion expanded={expanded} onChange={togglePanel}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Decos ({decos.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {orderBy(decos, (d) => Number(d.econtrato)).map((deco, i) => (
              <ListItem key={i}>
                <ListItemIcon>
                  <RouterIcon />
                </ListItemIcon>
                <ListItemText
                  primary={deco.serial?.toUpperCase() || ""}
                  secondary={deco.econtrato}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
