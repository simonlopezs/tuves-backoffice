import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Done, Phone, WhatsApp } from "@mui/icons-material";
import { Deco } from "../../../classes/Deco";
import { StateIcon } from "./StateIcon";
import { locationService } from "../../../services/location";
import { LngLat } from "../../../models/LngLat.model";
import { DecosList } from "./DecosList";

interface DecoDetailsProps {
  deco: Deco;
  location: LngLat | null;
}

export const DecoDetails = ({ deco, location }: DecoDetailsProps) => {
  const distance = locationService.calculateDistance(
    location,
    deco.getLocation()
  );

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

          <Box display="flex" justifyContent="center">
            <StateIcon size="large" distance={distance} />
          </Box>

          <Stack spacing={1.5}>
            <Typography variant="body1">
              Distancia: <b>{distance ? distance + " km" : "desconocida"}</b>
            </Typography>
            <Typography variant="body1">
              N° abonado: <b>{deco.getCode()}</b>
            </Typography>
            <Typography variant="body1">
              Dirección: <b>{deco.getAddress()}</b>
            </Typography>
            <Typography variant="body1">
              Pagos hechos: <b>{deco.getPayments()}</b>
            </Typography>
          </Stack>

          <DecosList decos={deco.getDecos()} />

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
          <Divider />
          <Button
            disabled={true}
            color="primary"
            variant="contained"
            startIcon={<Done />}
            size="large"
          >
            Registrar retiro
          </Button>
        </Stack>
      )}
    </>
  );
};
