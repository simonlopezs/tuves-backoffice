import { Check, Sort } from "@mui/icons-material";
import {
  Divider,
  Fab,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

const options = [
  {
    label: "Cercanía",
    key: "nombre",
  },
  {
    label: "Fecha de instalación",
    key: "fechaInst",
  },
  {
    label: "Fecha fin recarga",
    key: "finRecarga",
  },
];

const directions: { label: string; direction: "asc" | "desc" }[] = [
  {
    label: "Ascendente",
    direction: "asc",
  },
  {
    label: "Descendente",
    direction: "desc",
  },
];

interface SortMenuProps {
  orderBy: string;
  setOrderBy: (key: string) => void;
  orderDirection: "asc" | "desc";
  setOrderDirection: (direction: "asc" | "desc") => void;
}

export const SortMenu = ({
  orderBy,
  setOrderBy,
  orderDirection,
  setOrderDirection,
}: SortMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (action?: () => void) => {
    setAnchorEl(null);
    action && action();
  };

  return (
    <>
      <Fab
        onClick={handleClick}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        size="medium"
      >
        <Sort
          sx={{ transform: orderDirection === "asc" ? "scaleY(-1)" : "" }}
        />
      </Fab>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          sx: {
            width: 250,
          },
        }}
      >
        <MenuItem disableRipple sx={{ margin: 0 }}>
          <Typography variant="h6">Ordenar por</Typography>
        </MenuItem>
        {options.map(({ label, key }) => (
          <MenuItem key={key} onClick={() => setOrderBy(key)}>
            <ListItemIcon>{orderBy === key ? <Check /> : null}</ListItemIcon>
            {label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem disableRipple sx={{ margin: 0 }}>
          <Typography variant="h6">Dirección</Typography>
        </MenuItem>
        {directions.map(({ label, direction }) => (
          <MenuItem
            key={direction}
            onClick={() => setOrderDirection(direction)}
          >
            <ListItemIcon>
              {orderDirection === direction ? <Check /> : null}
            </ListItemIcon>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
