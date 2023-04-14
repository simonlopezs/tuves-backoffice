import { Close } from '@mui/icons-material'
import { Drawer, IconButton, Stack } from '@mui/material'
import { useCustomersContext } from './CustomersContext'

export const CustomerDetails = () => {

  const { selectedCustomer: customer, setSelectedCustomer } = useCustomersContext()

  return (

    <Drawer
      PaperProps={{
        sx: {
          height: "100vh",
        },
      }}
      anchor="bottom"
      open={!!customer}
      onClose={() => setSelectedCustomer(null)}
    >


      {customer && (
        <Stack p="0.5rem" sx={{ overflow: 'hidden' }} direction="column">

          <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
            <h2>{customer['NOMBRE']}</h2>
            <IconButton
              onClick={() => setSelectedCustomer(null)}
            >
              <Close />
            </IconButton>
          </Stack>

          <pre >{JSON.stringify(customer).replaceAll(',', '\n').slice(1, -1)}</pre>
        </Stack>
      )}
    </Drawer>

  )
}
