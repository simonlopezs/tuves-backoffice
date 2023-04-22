import { Button, CircularProgress, Stack } from "@mui/material";
import { useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

interface InfiniteListProps {
    hasNextPage: boolean,
    isNextPageLoading: boolean,
    items: any[],
    loadNextPage: () => void,
    children: (props: any) => JSX.Element,
    itemKey?: string
}

export const InfiniteList = ({ children, itemKey, isNextPageLoading, items, loadNextPage }: InfiniteListProps) => {

    const ref = useRef<any>(null)
    const getItemKey = (index: number, data: any) => {
        if (!itemKey) return index;
        const item = data[index];
        return item ? item[itemKey] : index;
    }

    return (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeList
                    itemSize={72.02}
                    height={(height || 400) - 48}
                    width={width || 300}
                    itemCount={items.length + 1}
                    overscanCount={5}
                    ref={ref}
                    itemData={items}
                // itemKey={getItemKey}
                >
                    {({ index, style, data }) => index < items.length ? children({ item: data[index], style }) :
                        (<Stack style={style} alignItems='center'>
                            {isNextPageLoading ? <CircularProgress></CircularProgress> :
                                <Button onClick={loadNextPage}>Mostrar más</Button>}
                        </Stack>)
                    }
                </FixedSizeList>
            )}
        </AutoSizer>
    );
}

