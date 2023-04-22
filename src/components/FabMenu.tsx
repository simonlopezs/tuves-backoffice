import { Fab, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

interface MenuOption {
    label: string;
    action: () => void;
}

interface FabMenuProps {
    options: MenuOption[];
    icon: JSX.Element
    color?: 'primary' | 'secondary'
}

export const FabMenu = ({ options, icon, color }: FabMenuProps) => {

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
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                size='medium'
                color={color}
            >
                {icon}
            </Fab>

            <Menu id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}

            >
                {options.map(({ label, action }, i) => (
                    <MenuItem key={i} onClick={() => handleClose(action)}>
                        {label}
                    </MenuItem>
                ))}
            </Menu >

        </>
    );
}
