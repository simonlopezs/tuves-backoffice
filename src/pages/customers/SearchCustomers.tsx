import { useQuery } from "react-query";
import { QueryOptions, dbConnector } from "../../api/db-connector";
import { ICustomer } from "../../models";
import { useRef, useState } from "react";
import { CustomerListItem } from "./components/CustomerListItem";
import {
  Divider,
  IconButton,
  OutlinedInput,
  Stack,
  InputAdornment,
  List,
  Box,
} from "@mui/material";
import { Customer } from "../../classes/Customer";
import { OverallSpinner } from "../../components/OverallSpinner";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";

export const SearchCustomers = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [term, setTerm] = useState<string>("");

  const fetchCustomers = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy: "fechaInst",
      orderDirection: "desc",
      filters: [
        { key: "nombre", operator: "==", value: searchTerm },
        { key: "rut", operator: "==", value: searchTerm },
        { key: "abonado", operator: "==", value: searchTerm },
      ],
      filterMode: "or",
      cursor,
    };

    return dbConnector
      .get<ICustomer>("customers", queryOptions)
      .then(({ data, nextCursor }) => ({
        data: data.map((item) => new Customer(item)),
        nextCursor,
      }));
  };

  const { data, isLoading } = useQuery(
    ["customers", "search", { searchTerm }],
    fetchCustomers,
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      enabled: !!searchTerm,
    }
  );

  const customers = data ? data.data : [];
  const search = () => {
    if (!term) return;
    setSearchTerm(term);
  };

  const clear = () => setTerm("");

  return (
    <>
      <OverallSpinner open={isLoading} />
      <Stack padding={1}>
        <OutlinedInput
          value={term}
          onChange={(ev) => setTerm(ev.target.value)}
          fullWidth
          placeholder="Buscar por nombre, rut o abonado"
          endAdornment={
            <InputAdornment position="end">
              <Box>
                {term && (
                  <IconButton onClick={clear}>
                    <CloseIcon />
                  </IconButton>
                )}
                <IconButton disabled={!term} onClick={search}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </InputAdornment>
          }
        />
      </Stack>
      <Divider />
      <List>
        {customers.map((item, i) => (
          <CustomerListItem key={i} style={{}} customer={item} />
        ))}
      </List>
    </>
  );
};
