import { Box, CircularProgress, Stack } from "@mui/material";
import { Ref, useEffect, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

interface InfiniteListProps {
    hasNextPage: boolean,
    isNextPageLoading: boolean,
    items: any[],
    loadNextPage: () => void,
    children: (props: any) => JSX.Element,
    sortParams: string[]
}

export const InfiniteList = ({ children, sortParams, isNextPageLoading, items, loadNextPage }: InfiniteListProps) => {

    const ref = useRef<any>(null)
    const hasMountedList = useRef(false)
    useEffect(() => {
        if (hasMountedList.current && ref.current) {
            ref.current.resetloadMoreItemsCache();
        }
        hasMountedList.current = true;
    }, [sortParams]);


    const itemCount = isNextPageLoading ? items.length + 1 : items.length;
    const isItemLoaded = (index: number) => index < items.length;


    return (
        <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                    ref={ref}
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    loadMoreItems={loadNextPage}
                >
                    {({ onItemsRendered, ref }) => (
                        <FixedSizeList
                            itemSize={72.02}
                            height={height || 400}
                            width={width || 300}
                            itemCount={itemCount}
                            overscanCount={5}
                            // onItemsRendered={onItemsRendered}
                            ref={ref}
                        >
                            {({ index, style }) => isItemLoaded(index) ? children({ item: items[index], style }) :
                                <Stack alignItems='center'> <CircularProgress /> </Stack>
                            }
                        </FixedSizeList>

                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
}

