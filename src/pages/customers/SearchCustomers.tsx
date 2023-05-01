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
  const [term, setTerm] = useState<string>("");
  const inputRef = useRef<HTMLElement | null>(null);

  const fetchCustomers = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy: "fechaInst",
      orderDirection: "desc",
      filters: [{ key: "nombre", operator: "==", value: term }],
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
    ["customers", "search", { searchTerm: term }],
    fetchCustomers,
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
      enabled: !!term,
    }
  );

  const customers = data ? data.data : [];
  const search = () => {
    const term = (inputRef.current?.childNodes[0] as HTMLInputElement).value;
    if (!term) return;
    setTerm(term);
  };

  const clear = () => {
    setTerm("");
    (inputRef.current?.childNodes[0] as HTMLInputElement).value = "";
  };

  return (
    <>
      <OverallSpinner open={isLoading} />
      <Stack padding={1}>
        <OutlinedInput
          ref={inputRef}
          fullWidth
          // placeholder="Buscar por nombre, rut o abonado"
          placeholder="Buscar por nombre"
          endAdornment={
            <InputAdornment position="end">
              <Box>
                <IconButton onClick={clear}>
                  <CloseIcon />
                </IconButton>
                <IconButton onClick={search}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </InputAdornment>
          }
        />
      </Stack>
      <Divider />
      <List>
        {customers.map((item) => (
          <CustomerListItem style={{}} customer={item} />
        ))}
      </List>
    </>
  );
};
