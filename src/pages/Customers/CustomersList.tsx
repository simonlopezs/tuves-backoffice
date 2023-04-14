import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Customer } from '../../models'
import { Done, ErrorOutline } from '@mui/icons-material'
import { useCustomersContext } from './CustomersContext'

interface CustomersListProps {
  customers: Customer[]
}

export const CustomersList = ({ customers }: CustomersListProps) => {

  const { setSelectedCustomer } = useCustomersContext()
  const selectCustomer = (customer: Customer) => setSelectedCustomer(customer);

  return (
    <List>
      {customers.map((customer) => (
        <ListItem
          onClick={() => selectCustomer(customer)}
          key={customer.id}
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              {customer['DIAS_SIN_RECARGAR'] > 0 ? <ErrorOutline color='error' /> : <Done color='primary' />}
            </ListItemIcon>
            <ListItemText
              primary={customer['NOMBRE']}
              secondary={customer['COMUNA']}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
