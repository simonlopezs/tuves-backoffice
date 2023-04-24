import { Box, Button, Divider, Fab, Stack } from "@mui/material";
import { useRef, useState } from "react";
import { FileType, UploadResult, xlsxService } from "../services/xlsx";
import { dbConnector } from "../api/db-connector";
import { useMutation } from "react-query";
import { Upload, Close, Save } from "@mui/icons-material";
import { useLayoutContext } from "../layout/LayoutContext";
import { ICustomer } from "../models";

const fileTypes: Record<FileType, string> = {
  customers: "Cartera de clientes",
  "all-decos": "Retiro de decos libres",
  "own-decos": "Retiro de decos propios",
};

export const UploadFile = () => {
  const [result, setResult] = useState<UploadResult | null>(null);
  const { load, stopLoad, showSnackbar } = useLayoutContext();
  const fileInput = useRef<HTMLInputElement>(null);
  const mutation = useMutation(
    (data: ICustomer[]) => dbConnector.saveBatch("customers", data, "rut"),
    {
      onMutate: () => {
        load();
      },
      onSuccess: () => {
        showSnackbar({
          message: "Los datos se guardaron correctamente",
          type: "success",
        });
      },
      onError: (err) => {
        showSnackbar({
          message: "Hubo un error al guardar los datos",
          type: "error",
        });
      },
      onSettled: () => {
        stopLoad();
        cancel();
      },
    }
  );

  const saveData = () => {
    if (!result?.data) return;
    mutation.mutate(result.data);
  };

  const onFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (files) {
      load();
      const file = files[0];
      xlsxService
        .loadFile(file)
        .then((result) => setResult(result))
        .catch((err) => {
          console.log(err);
        })
        .finally(() => stopLoad());
    }
  };

  const cancel = () => {
    fileInput.current!.value = "";
    setResult(null);
  };

  return (
    <Stack
      sx={{ height: "100%", boxSizing: "border-box" }}
      direction="column"
      justifyContent="space-between"
      p={1}
    >
      <Box>
        {result && (
          <Stack spacing={2}>
            <Box>
              <h2>{fileTypes[result.type]}</h2>
              <p>{result.data.length} registros</p>
            </Box>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Button startIcon={<Close />} onClick={cancel} variant="outlined">
                Cancelar
              </Button>
              <Button
                startIcon={<Save />}
                onClick={saveData}
                variant="contained"
                disableElevation
              >
                Guardar
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>

      <Stack sx={{ position: "fixed", bottom: 55 + 16, right: 16 }}>
        <Fab
          size="medium"
          onClick={() => fileInput.current?.click()}
          color="primary"
        >
          <Upload />
        </Fab>
        <input
          ref={fileInput}
          id="upload-file"
          hidden
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={onFileChange}
          type="file"
        />
      </Stack>
    </Stack>
  );
};
