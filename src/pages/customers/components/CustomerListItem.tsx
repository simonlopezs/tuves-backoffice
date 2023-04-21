import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Customer } from '../../../models'
import { Done, ErrorOutline } from '@mui/icons-material'
import { useLayoutContext } from '../../../layout/LayoutContext'
import { CustomerDetails } from './CustomerDetails'

interface CustomerListItemProps {
  customer: Customer,
  style: any
}


export const CustomerListItem = ({ customer, style }: CustomerListItemProps) => {
  const { setDrawerContent } = useLayoutContext()
  const selectCustomer = (customer: Customer) =>
    setDrawerContent(<CustomerDetails customer={customer} />)

  return (
    <ListItem
      style={style}
      onClick={() => selectCustomer(customer)}
      key={customer.RUT}
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
  )
}
