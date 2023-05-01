import { useInfiniteQuery } from "react-query";
import { QueryOptions, dbConnector } from "../../api/db-connector";
import { ICustomer } from "../../models";
import { useState } from "react";
import { flatten } from "lodash";
import { CustomerListItem } from "./components/CustomerListItem";
import { InfiniteList } from "../../components/InfiniteList";
import { Button, ButtonGroup, Divider, Stack } from "@mui/material";
import { Customer } from "../../classes/Customer";
import { lastDayOfMonth, subMonths } from "date-fns";
import { OverallSpinner } from "../../components/OverallSpinner";

type Period = "current" | "next";

export const LateCustomers = () => {
  const [period, setPeriod] = useState<Period>("current");
  const deltaMonth = period === "current" ? 0 : 1;
  const infDate = subMonths(lastDayOfMonth(new Date()), 3 - deltaMonth);
  const supDate = subMonths(lastDayOfMonth(new Date()), 2 - deltaMonth);

  const fetchCustomers = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy: "finRecarga",
      orderDirection: "asc",
      filters: [
        { key: "finRecarga", operator: ">=", value: infDate },
        { key: "finRecarga", operator: "<=", value: supDate },
      ],
      cursor,
    };

    return dbConnector
      .get<ICustomer>("customers", queryOptions)
      .then(({ data, nextCursor }) => ({
        data: data.map((item) => new Customer(item)),
        nextCursor,
      }));
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["customers", "late", { infDate, supDate }],
      fetchCustomers,
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24,
      }
    );

  const customers = flatten(data?.pages.map(({ data }) => data) || []);

  return (
    <>
      <OverallSpinner open={isLoading} />
      <Stack padding={1}>
        <ButtonGroup
          fullWidth
          variant="outlined"
          aria-label="outlined button group"
        >
          <Button
            disableElevation
            variant={period === "current" ? "contained" : "outlined"}
            onClick={() => setPeriod("current")}
          >
            Este mes
          </Button>
          <Button
            disableElevation
            variant={period === "next" ? "contained" : "outlined"}
            onClick={() => setPeriod("next")}
          >
            Próximo mes
          </Button>
        </ButtonGroup>
      </Stack>
      <Divider />
      <InfiniteList
        hasNextPage={hasNextPage || false}
        isNextPageLoading={isFetchingNextPage}
        items={customers}
        loadNextPage={fetchNextPage}
        itemSize={92.03}
        subHeight={52.5}
      >
        {({ item, style }) => (
          <CustomerListItem style={style} customer={item} />
        )}
      </InfiniteList>
    </>
  );
};
