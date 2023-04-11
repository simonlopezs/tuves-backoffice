import { CircularProgress, Stack } from '@mui/material'
import React from 'react'

export const OverallSpinner = () => {
    return (
        <Stack alignItems='center' justifyContent='center' sx={{
            width: '100vw',
            height: '100%',
            bgColor: 'rgba(0,0,0,.5)',
        }}>
            <CircularProgress />
        </Stack>
    )
}
