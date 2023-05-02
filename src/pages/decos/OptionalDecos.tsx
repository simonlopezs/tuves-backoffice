import { useInfiniteQuery } from "react-query";
import { Filter, QueryOptions, dbConnector } from "../../api/db-connector";
import { ICustomer } from "../../models";
import { useState } from "react";
import { flatten } from "lodash";
import { InfiniteList } from "../../components/InfiniteList";
import { Button, ButtonGroup, Divider, Stack } from "@mui/material";
import { Customer } from "../../classes/Customer";
import { lastDayOfMonth, subMonths } from "date-fns";
import { OverallSpinner } from "../../components/OverallSpinner";
import { DecoListItem } from "./components/DecoListItem";
import { IDeco } from "../../models/Deco.model";
import { Deco } from "../../classes/Deco";

type Period = "current" | "next";

export const OptionalDecos = () => {
  const [orderBy, setOrderBy] = useState("fchIngreso");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<Filter | null>(null);

  const fetchDecos = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy,
      orderDirection,
      cursor,
    };
    return dbConnector
      .get<IDeco>("decos", queryOptions)
      .then(({ data, nextCursor }) => ({
        data: data.map((item) => new Deco(item)),
        nextCursor,
      }));
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["decos", "optional", { orderBy, orderDirection, filter }],
      fetchDecos,
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24,
      }
    );

  const decos = flatten(data?.pages.map(({ data }) => data) || []);

  return (
    <>
      <OverallSpinner open={isLoading} />
      <InfiniteList
        hasNextPage={hasNextPage || false}
        isNextPageLoading={isFetchingNextPage}
        items={decos}
        loadNextPage={fetchNextPage}
        itemSize={92.03}
      >
        {({ item, style }) => <DecoListItem style={style} deco={item} />}
      </InfiniteList>
    </>
  );
};
