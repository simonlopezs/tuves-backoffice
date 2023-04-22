import { useInfiniteQuery, useQueryClient } from "react-query"
import { QueryOptions, dbConnector } from "../../api/db-connector"
import { Customer } from "../../models"
import { useState } from "react"
import { flatten } from "lodash"
import { CustomerListItem } from "./components/CustomerListItem"
import { InfiniteList } from "../../components/InfiniteList"
import { Stack } from "@mui/material"
import { FilterAlt, Sort } from "@mui/icons-material"
import { FabMenu } from "../../components/FabMenu"

export const AllCustomers = () => {

    const [orderBy, serOrderBy] = useState('NOMBRE')
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc')

    const fetchCustomers = ({ pageParam: cursor = undefined }) => {
        const queryOptions: QueryOptions = {
            orderBy,
            orderDirection,
            cursor
        }
        return dbConnector.get<Customer>('customers', queryOptions)
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
                itemKey="id"
            >
                {({ item, style }) => <CustomerListItem style={style} customer={item} />}
            </InfiniteList>

            <Stack spacing={2} sx={{ position: 'fixed', bottom: 55 + 16, right: 16 }}>
                <FabMenu color='primary' icon={<Sort />} options={[
                    { label: 'Nombre', action: () => serOrderBy('NOMBRE') },
                    { label: 'Fecha instalación', action: () => serOrderBy('FECHA_INST') },
                ]} />
                <FabMenu color='primary' icon={<FilterAlt />} options={[
                    { label: 'Ascendente', action: () => setOrderDirection('asc') },
                    { label: 'Descendente', action: () => setOrderDirection('desc') },
                ]} />

            </Stack>

        </>
    )
}
