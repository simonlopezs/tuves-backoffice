import {
  Box,
  Drawer,
  Fab,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { Add, Close, Done, Pending, Search } from "@mui/icons-material";
import customers from "../api/MOCK_CUSTOMERS.json";
import { useState } from "react";

const mockCustomers = customers.sort((a, b) =>
  b.createdAt < a.createdAt ? 1 : -1
);

interface Customer {
  id: string;
  name: string;
  createdAt: string;
  state: number;
}

export const Customers = () => {
  const [current, setCurrent] = useState<Customer | null>(null);
  const [term, setTerm] = useState("");
  const filteredCustomers = mockCustomers.filter((customer) =>
    term ? customer.name.toLowerCase().includes(term.toLowerCase()) : true
  );

  const viewCustomer = (customer: Customer) => setCurrent(customer);

  return (
    <Box
      sx={{ width: "100%", bgcolor: "background.paper", position: "relative" }}
    >
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

      <nav aria-label="main mailbox folders">
        <List>
          {filteredCustomers.map((customer) => (
            <ListItem
              onClick={() => viewCustomer(customer)}
              key={customer.id}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  {customer.state === 0 ? <Pending /> : <Done />}
                </ListItemIcon>
                <ListItemText
                  primary={customer.name}
                  secondary={customer.createdAt}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>

      <Fab
        sx={{
          position: "fixed",
          bottom: 68,
          right: 16,
        }}
        color="primary"
      >
        <Add />
      </Fab>

      <Drawer
        PaperProps={{
          sx: {
            height: "100vh",
          },
        }}
        anchor="bottom"
        open={!!current}
        onClose={() => setCurrent(null)}
      >


        {current && (
          <Stack p="0.5rem" direction="column">

            <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
              <h2>{current.name}</h2>
              <IconButton
                onClick={() => setCurrent(null)}
              >
                <Close />
              </IconButton>
            </Stack>

            <h2>{current.createdAt}</h2>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
};
