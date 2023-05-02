import { Box, Button, Stack, Typography } from "@mui/material";
import { Phone, WhatsApp } from "@mui/icons-material";
import { Deco } from "../../../classes/Deco";

interface DecoDetailsProps {
  deco: Deco;
}

export const DecoDetails = ({ deco }: DecoDetailsProps) => {
  return (
    <>
      {deco && (
        <Stack spacing={2} padding={1}>
          <Box>
            <Typography variant="h5">{deco.getName()}</Typography>
            <Typography color="GrayText" variant="h6">
              {deco.getRut()}
            </Typography>
          </Box>

          {/* <StateIcon size="large" daysLate={deco.getDaysLate()} /> */}

          <Stack spacing={1.5}>
            <Typography variant="body1">
              N° abonado: <b>{deco.getCode()}</b>
            </Typography>
            <Typography variant="body1">
              Dirección: <b>{deco.getAddress()}</b>
            </Typography>
            <Typography variant="body1">
              Fecha de instalación:{" "}
              {/* <b>{deco.getDate("instalacion") as string}</b> */}
            </Typography>
            <Typography variant="body1">
              Fecha fin recarga:{" "}
              {/* <b>{deco.getDate("finRecarga") as string}</b> */}
            </Typography>
            <Typography variant="body1">
              Pagos hechos: <b>{deco.getPayments()}</b>
            </Typography>
            <Typography variant="body1">
              De baja:{" "}
              {/* <b>{deco.getDaysToLimitDate() || "sin información"}</b> */}
            </Typography>
          </Stack>
          <Stack marginTop={2} spacing={2}>
            {deco.getPhones().map((phone, i) => (
              <Stack key={i} spacing={1} marginBottom={1}>
                <Typography variant="body1">Teléfono {i + 1}</Typography>
                <Button
                  onClick={() => deco.call(phone)}
                  variant="outlined"
                  startIcon={<Phone />}
                >
                  Llamar
                </Button>
                <Button
                  onClick={() => deco.sendWhatsapp(phone)}
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
