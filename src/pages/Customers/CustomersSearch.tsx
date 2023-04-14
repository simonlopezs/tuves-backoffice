import { Search } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import { useState } from 'react';

export const CustomersSearch = () => {

    const [term, setTerm] = useState("");


    //     const filteredCustomers = customers?.filter((customer: Customer) =>
    //     term ? JSON.stringify(customer).toLowerCase().includes(term.toLowerCase()) : true
    //   ) || []

    return (
        <FormControl
            sx={{ p: 1, width: "100%", boxSizing: "border-box" }}
            variant="outlined"
        >
            <OutlinedInput
                placeholder="Buscar"
                type="text"
                onChange={(e) => setTerm(e.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton aria-label="search" edge="end">
                            <Search />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}
