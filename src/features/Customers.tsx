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
import { Add, CheckCircle, Close, Done, ErrorOutline, Pending, Search } from "@mui/icons-material";
import { useState } from "react";
import { dbConnector } from "../api/db-connector";
import { useQuery } from "react-query";
import { Customer } from "../models";
import { OverallSpinner } from "../components/OverallSpinner";

const getCustomers = async () => dbConnector.get<Customer>('customers')

export const Customers = () => {

  const { data: customers, isLoading } = useQuery('customers', getCustomers)
  const [current, setCurrent] = useState<Customer | null>(null);
  const [term, setTerm] = useState("");
  console.log(customers)

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error: {JSON.stringify(error)}</div>

  const filteredCustomers = customers?.filter((customer: Customer) =>
    term ? JSON.stringify(customer).toLowerCase().includes(term.toLowerCase()) : true
  ) || []

  const viewCustomer = (customer: Customer) => setCurrent(customer);

  return (
    <Box>
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

      <nav style={{
        height: 'calc(100vh - 172px)',
        overflowY: 'auto'
      }}>
        {isLoading && <OverallSpinner />}
        <List>
          {filteredCustomers.map((customer) => (
            <ListItem
              onClick={() => viewCustomer(customer)}
              key={customer.id}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  {customer['DIAS_SIN_RECARGAR'] > 0 ? <ErrorOutline color='error' /> : <Done color='primary' />}
                </ListItemIcon>
                <ListItemText
                  primary={customer['NOMBRE']}
                  secondary={customer['COMUNA']}
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
          <Stack p="0.5rem" sx={{ overflow: 'hidden' }} direction="column">

            <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
              <h2>{current['NOMBRE']}</h2>
              <IconButton
                onClick={() => setCurrent(null)}
              >
                <Close />
              </IconButton>
            </Stack>

            <pre >{JSON.stringify(current).replaceAll(',', '\n').slice(1, -1)}</pre>
          </Stack>
        )}
      </Drawer>
    </Box >
  );
};
