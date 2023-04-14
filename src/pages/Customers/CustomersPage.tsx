import {
  Box,
  Pagination,
} from "@mui/material";
import { useState } from "react";
import { dbConnector } from "../../api/db-connector";
import { useQuery } from "react-query";
import { Customer } from "../../models";
import { OverallSpinner } from "../../components/OverallSpinner";
import { CustomerDetails } from "./CustomerDetails";
import { CustomersList } from "./CustomersList";
import { CustomersProvider } from "./CustomersContext";
import { CustomersSearch } from "./CustomersSearch";

const getCustomers = async () => dbConnector.get<Customer>('customers')

export const CustomersPage = () => {

  const { data: customers, isLoading } = useQuery('customers', getCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1)
  const onPageChange = (_: any, page: number) => setPage(page)

  return (
    <CustomersProvider value={{
      customers: customers || [],
      selectedCustomer,
      setSelectedCustomer
    }}>

      <CustomersSearch />

      <Box sx={{
        height: 'calc(100vh - 172px)',
        overflowY: 'auto',
      }}>
        {isLoading && <OverallSpinner />}
        <CustomersList customers={customers || []} />

        <Pagination size='medium' count={3} page={page} onChange={onPageChange} sx={{ my: '1rem', display: 'flex', justifyContent: 'center' }} />

      </Box>

      {/* <Fab
        sx={{
          position: "fixed",
          bottom: 68,
          right: 16,
        }}
        color="primary"
      >
        <Add />
      </Fab> */}

      <CustomerDetails />
    </CustomersProvider>
  );
};
