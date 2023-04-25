import { Button, CircularProgress, Stack } from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

const TABS_HEIGHT = 48;
interface InfiniteListProps {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: any[];
  loadNextPage: () => void;
  children: (props: any) => JSX.Element;
  itemSize: number;
  subHeight?: number;
}

export const InfiniteList = ({
  children,
  isNextPageLoading,
  items,
  loadNextPage,
  itemSize,
  subHeight = 0,
}: InfiniteListProps) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          itemSize={itemSize}
          height={(height || 400) - TABS_HEIGHT - subHeight}
          width={width || 300}
          itemCount={items.length + 1}
          overscanCount={5}
          itemData={items}
        >
          {({ index, style, data }) =>
            index < items.length ? (
              children({ item: data[index], style })
            ) : (
              <Stack style={style} alignItems="center" justifyContent="center">
                {isNextPageLoading ? (
                  <CircularProgress></CircularProgress>
                ) : (
                  <Button size="large" onClick={loadNextPage}>
                    Mostrar más
                  </Button>
                )}
              </Stack>
            )
          }
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};
