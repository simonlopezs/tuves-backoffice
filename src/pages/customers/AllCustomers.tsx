import { useInfiniteQuery } from "react-query";
import { Filter, QueryOptions, dbConnector } from "../../api/db-connector";
import { ICustomer } from "../../models";
import { useState } from "react";
import { flatten } from "lodash";
import { CustomerListItem } from "./components/CustomerListItem";
import { InfiniteList } from "../../components/InfiniteList";
import { Stack } from "@mui/material";
import { SortMenu } from "./components/SortMenu";
import { Customer } from "../../classes/Customer";
import { FilterMenu } from "./components/FilterMenu";

export const AllCustomers = () => {
  const [orderBy, setOrderBy] = useState("fechaInst");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<Filter | null>(null);

  const fetchCustomers = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy,
      orderDirection,
      cursor,
    };
    if (filter) queryOptions.filters = [filter];
    return dbConnector
      .get<ICustomer>("customers", queryOptions)
      .then(({ data, nextCursor }) => ({
        data: data.map((item) => new Customer(item)),
        nextCursor,
      }));
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["customers", { orderBy, orderDirection, filter }],
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
      <InfiniteList
        hasNextPage={hasNextPage || false}
        isNextPageLoading={isFetchingNextPage}
        items={customers}
        loadNextPage={fetchNextPage}
        itemSize={92.03}
      >
        {({ item, style }) => (
          <CustomerListItem style={style} customer={item} />
        )}
      </InfiniteList>

      <Stack spacing={2} sx={{ position: "fixed", bottom: 55 + 16, right: 16 }}>
        <SortMenu
          {...{ orderBy, setOrderBy, orderDirection, setOrderDirection }}
        />
        <FilterMenu {...{ filter, setFilter }} />
      </Stack>
    </>
  );
};
