import { Box, Button, Stack, Typography } from "@mui/material";
import { Customer } from "../../../classes/Customer";
import { Phone, WhatsApp } from "@mui/icons-material";
import { StateIcon } from "./StateIcon";

interface CustomerDetailProps {
  customer: Customer;
}

export const CustomerDetails = ({ customer }: CustomerDetailProps) => {
  return (
    <>
      {customer && (
        <Stack spacing={2} padding={1}>
          <Box>
            <Typography variant="h5">{customer.getName()}</Typography>
            <Typography color="GrayText" variant="h6">
              {customer.getRut()}
            </Typography>
          </Box>

          <StateIcon size="large" daysLate={customer.getDaysLate()} />

          <Stack spacing={1.5}>
            <Typography variant="body1">
              N° abonado: <b>{customer.getCode()}</b>
            </Typography>
            <Typography variant="body1">
              Dirección: <b>{customer.getAddress()}</b>
            </Typography>
            <Typography variant="body1">
              Fecha de instalación:{" "}
              <b>{customer.getDate("instalacion") as string}</b>
            </Typography>
            <Typography variant="body1">
              Fecha fin recarga:{" "}
              <b>{customer.getDate("finRecarga") as string}</b>
            </Typography>
            <Typography variant="body1">
              Pagos hechos: <b>{customer.getPayments()}</b>
            </Typography>
            <Typography variant="body1">
              De baja:{" "}
              <b>{customer.getDaysToLimitDate() || "sin información"}</b>
            </Typography>
          </Stack>
          <Stack marginTop={2} spacing={2}>
            {customer.getPhones().map((phone, i) => (
              <Stack key={i} spacing={1} marginBottom={1}>
                <Typography variant="body1">Teléfono {i + 1}</Typography>
                <Button
                  onClick={() => customer.call(phone)}
                  variant="outlined"
                  startIcon={<Phone />}
                >
                  Llamar
                </Button>
                <Button
                  onClick={() => customer.sendWhatsapp(phone)}
                  color="success"
                  variant="outlined"
                  startIcon={<WhatsApp />}
                >
                  Enviar whatsapp
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};
