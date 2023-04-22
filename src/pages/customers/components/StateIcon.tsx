import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { ClickAwayListener, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

interface StateIconProps {
    daysLate: number;
}

type State = 'ok' | 'warning' | 'error';

const states: Record<State, { icon: JSX.Element, color: 'success' | 'warning' | 'error' }> = {
    ok: {
        icon: <CheckCircleOutline />,
        color: 'success'
    },
    warning: {
        icon: <ErrorOutline />,
        color: 'warning'
    },
    error: {
        icon: <ErrorOutline />,
        color: 'error'
    },
}

export const StateIcon = ({ daysLate }: StateIconProps) => {
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.stopPropagation();
        setOpen(true);
    };

    useEffect(() => {
        if (open) {
            setInterval(() => {
                setOpen(false);
            }, 2000);
        }
    }, [open])

    const state: State = daysLate <= 0 ? 'ok' : (daysLate <= 30 ? 'warning' : 'error');
    const message = daysLate <= 0 ? 'Al día' : `Atrasado ${daysLate} días`;
    const stateData = states[state];
    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
                PopperProps={{
                    disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={message}
            >
                <IconButton onClick={handleTooltipOpen} aria-label={state} color={stateData.color}>
                    {stateData.icon}
                </IconButton>
            </Tooltip>
        </ClickAwayListener>

    )
}
