import { useInfiniteQuery, useQuery } from "react-query"
import { QueryOptions, dbConnector } from "../../api/db-connector"
import { Customer } from "../../models"
import { useEffect, useRef, useState } from "react"
import { flatten } from "lodash"
import { Box, Button, CircularProgress, ListItem, ListItemButton, ListItemText } from "@mui/material"
import { FixedSizeList as List, ListOnScrollProps } from "react-window"
import { CustomerListItem } from "./components/CustomerListItem"
import InfiniteLoader from "react-window-infinite-loader"
import { InfiniteList } from "../../components/InfiniteList"


export const AllCustomers = () => {

    const [orderBy, serOrderBy] = useState('NOMBRE')
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc')

    const fetchCustomers = ({ pageParam: startAfter = undefined }) => {
        const queryOptions: QueryOptions = {
            orderBy,
            orderDirection,
            startAfter
        }
        return dbConnector.get<Customer>('customers', queryOptions)
    }
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery(['customers'],
        fetchCustomers,
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 60 * 24,
        })

    const customers = flatten(data?.pages.map(({ data }) => data) || []);

    const handleScroll = ({ scrollDirection, scrollUpdateWasRequested, scrollOffset }: ListOnScrollProps) => {
        console.log(scrollOffset)
        console.log('scrollDirection', scrollDirection);
        if (scrollDirection === 'forward' && !isFetchingNextPage && !scrollUpdateWasRequested && hasNextPage)
            console.log('fetchNextPage')
        // fetchNextPage()
    }

    const loadMoreItems = (data: any) => {
        console.log('loadMoreItems:', data)
    }


    return (
        <>
            <InfiniteList
                hasNextPage={hasNextPage || false}
                isNextPageLoading={isFetchingNextPage}
                items={customers}
                loadNextPage={fetchNextPage}
                sortParams={[orderBy, orderDirection]}
            >
                {({ item, style }) => <CustomerListItem style={style} customer={item} />}
            </InfiniteList>

            <Button onClick={() => fetchNextPage()}>Fetch</Button>
            <Button onClick={() => setOrderDirection(dir => dir === 'asc' ? 'desc' : 'asc')}>Change order</Button>

        </>
    )
}
