import { Close, Done, Pending, Person } from "@mui/icons-material";
import { Box, Button, ButtonProps, CircularProgress, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { useState } from "react";
import { xlsxService } from "../services/XlsxImporter";

type UploadType = 'technical' | 'customers' | 'late' | 'unstable' | 'decos';

interface UploadOptionData {
  label: string,
  icon: React.ReactNode,
  action: (file: File) => Promise<any[]>
}

const uploadOptions: Record<UploadType, UploadOptionData> = {
  customers: {
    label: 'Clientes actuales',
    icon: <Person />,
    action: (file: File) => xlsxService.importCustomers(file)
  },
  technical: {
    label: 'Servicios técnicos',
    icon: <Person />,
    action: () => Promise.resolve([])
  },
  late: {
    label: 'Clientes morosos',
    icon: <Person />,
    action: () => Promise.resolve([])
  },
  unstable: {
    label: 'Clientes inestables',
    icon: <Person />,
    action: () => Promise.resolve([])
  },
  decos: {
    label: 'Retiro decos',
    icon: <Person />,
    action: () => Promise.resolve([])
  }
}

export const Upload = () => {

  const [current, setCurrent] = useState<UploadOptionData | null>(null);
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const saveData = () => {
    console.log('saving data:', data)
  }

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files
    if (files) {
      const file = files[0]
      loadFile(file)
    }
  }

  const loadFile = async (file: File) => {
    if (!current) return;
    setLoading(true)
    const data = await current.action(file)
    setData(data)
    setLoading(false)
  }

  const cancel = () => {
    setCurrent(null);
    setData(null);
  }

  return (<Box p={1}>

    <Stack spacing={2}>
      {
        Object.entries(uploadOptions).map(([key, option]) => (
          <CustomButton key={key} onClick={() => setCurrent(option)} icon={option.icon} label={option.label} />
        ))
      }
    </Stack>

    <Drawer
      PaperProps={{
        sx: {
          height: "100vh",
        },
      }}
      anchor="bottom"
      open={!!current}
      onClose={cancel}
    >

      {current && (<Box p={1}>

        <Stack direction='row' alignItems='flex-start' justifyContent='space-between'>
          <h2>{current.label}</h2>
          <IconButton
            onClick={cancel}
          >
            <Close />
          </IconButton>
        </Stack>

        <Stack spacing={4}>
          <input
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={onFileChange} type="file" />

          <Button disabled={!data} onClick={saveData} variant='contained'>Cargar</Button>

          {loading && (
            <Box
              display="flex"
              justifyContent="center"
            >
              <CircularProgress sx={{ margin: 'auto' }} />
            </Box>
          )
          }

          {data &&
            <>
              <h3>{data.length} registros</h3>
              <List sx={{ marginTop: '0!important' }}>
                {data.map((item, i) => (
                  <ListItem
                    key={i}
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary={item['NOMBRE']}
                        secondary={item['RUT']}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          }


        </Stack>
      </Box>

      )}
    </Drawer>

  </Box>)
};

const CustomButton = ({ label, icon, ...props }: ButtonProps & {
  label: string,
  icon: React.ReactNode
}) => (
  <Button {...props} size='large' variant="outlined">{label}</Button>
)
