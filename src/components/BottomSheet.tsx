import { Drawer, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";

export const BottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (value: boolean) => setIsOpen(value);
  return (
    <Drawer
      PaperProps={{
        sx: {
          height: "100vh",
        },
      }}
      anchor="bottom"
      open={isOpen}
      onClose={() => toggleDrawer(false)}
    >
      <IconButton
        sx={{
          alignSelf: "flex-end",
        }}
        onClick={() => toggleDrawer(false)}
      >
        <Close />
      </IconButton>
    </Drawer>
  );
};
