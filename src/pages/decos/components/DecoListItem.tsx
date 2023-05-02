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
  Router as RouterIcon,
  HomeRepairServiceOutlined,
} from "@mui/icons-material";
import { DecoDetails } from "./DecoDetails";
import { StateIcon } from "./StateIcon";

interface DecoListItemProps {
  deco: Deco;
  style: any;
}

export const DecoListItem = ({ deco, style }: DecoListItemProps) => {
  const { setDrawerContent } = useLayoutContext();
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
          {<StateIcon location={deco.getLocation()} />}
        </ListItemIcon>
        <ListItemText
          primary={deco.getName()}
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                {deco.getTown()}
              </Typography>
              <span style={{ display: "flex", gap: "16px" }}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <HomeRepairServiceOutlined fontSize="small" />
                  <span>{deco.getDateAgo()}</span>
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
