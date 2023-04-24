import { Stack } from '@mui/material'
import { Customer } from '../../../classes/Customer'

interface CustomerDetailProps {
  customer: Customer
}

export const CustomerDetails = ({ customer }: CustomerDetailProps) => {

  const close = () => console.log('close')

  return (
    <>
      {customer && (
        <Stack p="0.5rem" sx={{ overflow: 'hidden' }} direction="column">
          <pre >{JSON.stringify(customer).replaceAll(',', '\n').slice(1, -1)}</pre>
        </Stack>
      )}
    </>
  )
}
