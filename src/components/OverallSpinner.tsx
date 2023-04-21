import { Backdrop, CircularProgress } from '@mui/material'

export interface OveralSpinnerProps {
    open: boolean
}

export const OverallSpinner = ({ open }: OveralSpinnerProps) => {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}
