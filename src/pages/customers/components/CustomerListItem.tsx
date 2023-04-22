import { ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { Customer } from '../../../models'
import { Done, ErrorOutline } from '@mui/icons-material'
import { useLayoutContext } from '../../../layout/LayoutContext'
import { CustomerDetails } from './CustomerDetails'
import { startCase } from 'lodash'
import { formatRut } from '../../../utils/formatRut'
import { titlecase } from '../../../utils/titlecase'
import { StateIcon } from './StateIcon'

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
      <ListItemButton disableRipple>
        <ListItemIcon>
          {<StateIcon daysLate={customer['DIAS_SIN_RECARGAR']} />}
        </ListItemIcon>
        <ListItemText
          primary={titlecase(customer['NOMBRE'])}
          secondary={(<>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
            >
              {formatRut(customer['RUT'])}
            </Typography>
            <br /> {titlecase(customer['COMUNA'])} &nbsp;&nbsp;|&nbsp;&nbsp; {customer['FECHA_INST']}
          </>
          )}
        />
      </ListItemButton>
    </ListItem>
  )
}
