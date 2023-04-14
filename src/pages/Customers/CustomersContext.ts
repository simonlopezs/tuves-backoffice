import { createContext, useContext } from "react";
import { Customer } from "../../models";

export interface CustomersState {
    selectedCustomer: Customer | null,
    setSelectedCustomer(customer: Customer | null): void,
    customers: Customer[],
}

const defaultCustomersState: CustomersState = {
    selectedCustomer: null,
    setSelectedCustomer: () => { },
    customers: []
}

const CustomersContext = createContext(defaultCustomersState)
export const CustomersProvider = CustomersContext.Provider
export const useCustomersContext = () => useContext(CustomersContext)
