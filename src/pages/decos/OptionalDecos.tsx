import { useInfiniteQuery } from "react-query";
import {
  Filter,
  QueryOptions,
  ResponseData,
  dbConnector,
} from "../../api/db-connector";
import { useState } from "react";
import { flatten } from "lodash";
import { InfiniteList } from "../../components/InfiniteList";
import { OverallSpinner } from "../../components/OverallSpinner";
import { DecoListItem } from "./components/DecoListItem";
import { IDeco } from "../../models/Deco.model";
import { Deco } from "../../classes/Deco";
import { Fab, Stack } from "@mui/material";
import { FilterMenu } from "./components/FilterMenu";
import { Radar } from "@mui/icons-material";
import { useDecosContext } from "./DecosContext";

export const OptionalDecos = () => {
  const [filter, setFilter] = useState<Filter | null>(null);
  const [orderBy, setOrderBy] = useState<"cantidadDecos" | "geohash">(
    "cantidadDecos"
  );
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const { location } = useDecosContext();

  const fetchDecos = async ({ pageParam: cursor = undefined }) => {
    const queryOptions: QueryOptions = {
      orderBy,
      orderDirection,
      cursor,
      filters: filter ? [filter] : [],
    };
    let promise: Promise<ResponseData<IDeco>>;
    if (orderBy === "geohash")
      promise = dbConnector.getByGeohash<IDeco>("decos", cursor, location);
    else promise = dbConnector.get<IDeco>("decos", queryOptions);

    return promise.then(({ data, nextCursor }) => ({
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
  const toggleGeoFilter = () => {
    if (filter) setFilter(null);
    setOrderBy(orderBy === "geohash" ? "cantidadDecos" : "geohash");
  };

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
        showMore={orderBy !== "geohash"}
      >
        {({ item, style }) => <DecoListItem style={style} deco={item} />}
      </InfiniteList>
      <Stack spacing={2} sx={{ position: "fixed", bottom: 55 + 16, right: 16 }}>
        <Fab
          color={orderBy === "geohash" ? "primary" : "default"}
          disabled={!location}
          onClick={toggleGeoFilter}
          size="medium"
        >
          <Radar />
        </Fab>
        <FilterMenu
          disabled={orderBy === "geohash"}
          {...{ filter, setFilter }}
        />
      </Stack>
    </>
  );
};
