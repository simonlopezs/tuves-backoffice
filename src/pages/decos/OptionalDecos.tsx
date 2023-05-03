import { useInfiniteQuery } from "react-query";
import { Filter, QueryOptions, dbConnector } from "../../api/db-connector";
import { useState } from "react";
import { flatten } from "lodash";
import { InfiniteList } from "../../components/InfiniteList";
import { OverallSpinner } from "../../components/OverallSpinner";
import { DecoListItem } from "./components/DecoListItem";
import { IDeco } from "../../models/Deco.model";
import { Deco } from "../../classes/Deco";
import { Stack } from "@mui/material";
import { SortMenu } from "./components/SortMenu";
import { FilterMenu } from "./components/FilterMenu";

export const OptionalDecos = () => {
  const [orderBy, setOrderBy] = useState("fchIngreso");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<Filter | null>(null);

  const fetchDecos = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy: "cantidadDecos",
      orderDirection: "desc",
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
      <Stack spacing={2} sx={{ position: "fixed", bottom: 55 + 16, right: 16 }}>
        <FilterMenu {...{ filter, setFilter }} />
      </Stack>
    </>
  );
};
