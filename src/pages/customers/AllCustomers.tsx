import { useInfiniteQuery } from "react-query"
import { QueryOptions, dbConnector } from "../../api/db-connector"
import { ICustomer } from "../../models"
import { useState } from "react"
import { flatten } from "lodash"
import { CustomerListItem } from "./components/CustomerListItem"
import { InfiniteList } from "../../components/InfiniteList"
import { Stack } from "@mui/material"
import { SortMenu } from "./components/SortMenu"

export const AllCustomers = () => {

    const [orderBy, setOrderBy] = useState('FECHA_INST')
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc')
    // const [filter, setFilter] = useState(null)

    const fetchCustomers = ({ pageParam: cursor = undefined }) => {
        const queryOptions: QueryOptions = {
            orderBy,
            orderDirection,
            cursor
        }
        return dbConnector.get<ICustomer>('customers', queryOptions)
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery(['customers', orderBy, orderDirection],
            fetchCustomers,
            {
                getNextPageParam: (lastPage) => lastPage?.nextCursor,
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 60 * 24,
            })


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
                {({ item, style }) => <CustomerListItem style={style} customer={item} />}
            </InfiniteList>

            <Stack spacing={2} sx={{ position: 'fixed', bottom: 55 + 16, right: 16 }}>
                <SortMenu {...{ orderBy, setOrderBy, orderDirection, setOrderDirection }} />
                {/* <FilterMenu items={[]} /> */}
            </Stack>

        </>
    )
}
