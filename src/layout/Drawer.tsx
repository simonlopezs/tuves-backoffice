import { IconButton, Drawer as MuiDrawer, Stack } from "@mui/material";
import { useLayoutContext } from "./LayoutContext";
import { Close } from "@mui/icons-material";

export const Drawer = () => {

    const { drawerContent, closeDrawer } = useLayoutContext();

    return (
        <MuiDrawer
            PaperProps={{
                sx: {
                    height: "100vh",
                },
            }}
            anchor="bottom"
            open={!!drawerContent}
            onClose={closeDrawer}
        >
            <Stack direction='row' justifyContent='flex-end'>
                <IconButton
                    onClick={closeDrawer}
                >
                    <Close />
                </IconButton>
            </Stack>

            {drawerContent}
        </MuiDrawer>
    )
}
