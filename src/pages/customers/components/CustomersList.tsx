import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Pagination } from '@mui/material'
import { Customer } from '../../../models'
import { Done, ErrorOutline } from '@mui/icons-material'
import { useLayoutContext } from '../../../layout/LayoutContext'
import { CustomerDetails } from './CustomerDetails'
import { useState } from 'react'

interface CustomersListProps {
  customers: Customer[]
}

export const CustomersList = ({ customers }: CustomersListProps) => {

  const { setDrawerContent } = useLayoutContext()
  const [page, setPage] = useState(1)

  const onPageChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value)

  const selectCustomer = (customer: Customer) =>
    setDrawerContent(<CustomerDetails customer={customer} />)

  return (
    <>
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
      <Pagination size='large' count={5} page={page} onChange={onPageChange} sx={{ my: '1rem', display: 'flex', justifyContent: 'center' }} />
    </>
  )
}
