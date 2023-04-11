import { AccountCircle, LogoutOutlined } from '@mui/icons-material'
import { Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from '@mui/material'
import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../router';
import { SessionContext } from '../App';

export const Header = ({ height }: { height: number }) => {

    const location = useLocation()
    const { logout } = useContext(SessionContext)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        logout()
        setAnchorEl(null);
    }

    const path = location.pathname.split('/').pop()
    const pageName = path ? ROUTES.find(el => el.path === path)?.text : ''

    return (
        <Box sx={{
            height: `${height}px`,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            p: '0.5rem',
            boxSizing: 'border-box',
        }}>
            <h3>{pageName}</h3>

            <IconButton
                sx={{ p: 0, color: 'primary.contrastText' }}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <AccountCircle />
            </IconButton>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cerrar sesión</ListItemText>
                </MenuItem>

            </Menu>

        </Box>
    )
}
