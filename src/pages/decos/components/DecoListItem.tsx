import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLayoutContext } from "../../../layout/LayoutContext";
import { Deco } from "../../../classes/Deco";
import {
  RouterOutlined as RouterIcon,
  NavigationOutlined,
} from "@mui/icons-material";
import { DecoDetails } from "./DecoDetails";
import { StateIcon } from "./StateIcon";
import { locationService } from "../../../services/location";
import { useDecosContext } from "../DecosContext";
import { useMemo } from "react";

interface DecoListItemProps {
  deco: Deco;
  style: any;
}

export const DecoListItem = ({ deco, style }: DecoListItemProps) => {
  const { setDrawerContent } = useLayoutContext();
  const { location: myLocation } = useDecosContext();
  const distance = useMemo(
    () => locationService.calculateDistance(myLocation, deco.getLocation()),
    [myLocation, location]
  );
  const selectDeco = (deco: Deco) =>
    setDrawerContent(<DecoDetails deco={deco} />);

  return (
    <ListItem
      style={style}
      onClick={() => selectDeco(deco)}
      key={deco.getId()}
      disablePadding
    >
      <ListItemButton disableRipple>
        <ListItemIcon>
          {<StateIcon distance={distance} size="large" />}
        </ListItemIcon>
        <ListItemText
          primary={deco.getName()}
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                {deco.getTown() || ""}
              </Typography>
              <span style={{ display: "flex", gap: "16px" }}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <NavigationOutlined fontSize="small" />
                  <span>{distance ? distance + " km" : ""}</span>
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <RouterIcon fontSize="small" />
                  <span>{deco.getDecos().length}</span>
                </span>
              </span>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
