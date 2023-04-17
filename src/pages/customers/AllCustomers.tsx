import { useQuery } from "react-query"
import { dbConnector } from "../../api/db-connector"
import { CustomersList } from "./components/CustomersList"
import { Customer } from "../../models"

const getCustomers = () => dbConnector.get<Customer>('customers')

export const AllCustomers = () => {


    const { data, isLoading, error } = useQuery(['customers'], () => getCustomers())

    return (
        <CustomersList customers={data || []} />
    )
}
