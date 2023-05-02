import { Box, Button, Divider, Stack } from "@mui/material";
import { useRef, useState } from "react";
import { FileType, UploadResult, xlsxService } from "../services/xlsx";
import { dbConnector } from "../api/db-connector";
import { useMutation } from "react-query";
import { Upload, Close, Save } from "@mui/icons-material";
import { useLayoutContext } from "../layout/LayoutContext";
import { ICustomer } from "../models";
import { chain, compact, uniqBy } from "lodash";

const fileTypes: Record<FileType, string> = {
  customers: "Cartera de clientes",
  decos: "Retiro de decos",
};

type ResultError = "string";

const persistData = (data: ICustomer[], collection: "customers" | "decos") =>
  dbConnector.saveBatch(collection, data, "rut").then(() => {
    const communes = formatCommunes(data);
    return dbConnector.save("meta", { data: communes }, "communes");
  });

export const UploadFile = () => {
  const [result, setResult] = useState<UploadResult | ResultError | null>(null);
  const { load, stopLoad, showSnackbar } = useLayoutContext();
  const fileInput = useRef<HTMLInputElement>(null);
  const mutation = useMutation(
    (result: UploadResult) => persistData(result.data, result.type),
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
    if (!result || typeof result === "string") return;
    mutation.mutate(result);
  };

  const onFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (files) {
      load();
      const file = files[0];
      xlsxService
        .loadFile(file)
        .then((result) => setResult(result))
        .catch((err: any) => setResult(err.message))
        .finally(() => stopLoad());
    }
  };

  const cancel = () => {
    fileInput.current!.value = "";
    setResult(null);
  };

  return (
    <Box height="100%" padding={1}>
      {result ? (
        <Stack spacing={2}>
          {typeof result === "string" ? (
            <>
              <p style={{ textAlign: "center" }}>{result}</p>
              <Button onClick={cancel} variant="outlined">
                Atrás
              </Button>
            </>
          ) : (
            <>
              <Box>
                <h2>{fileTypes[result.type]}</h2>
                <p>{result.data.length} registros</p>
              </Box>
              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Button
                  startIcon={<Close />}
                  onClick={cancel}
                  variant="outlined"
                >
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
            </>
          )}
        </Stack>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="large"
            variant="outlined"
            onClick={() => fileInput.current?.click()}
            color="primary"
          >
            Subir archivo <Upload />
          </Button>
        </Box>
      )}
      <input
        ref={fileInput}
        id="upload-file"
        hidden
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={onFileChange}
        type="file"
      />
    </Box>
  );
};

const formatCommunes = (data: { comuna: string; urbanizacion: string }[]) => {
  return chain(data)
    .groupBy("comuna")
    .mapValues((c) => uniqBy(c, "urbanizacion").map((v) => v.urbanizacion))
    .toPairs()
    .map(([commune, towns]) => ({ name: commune, towns: compact(towns) }))
    .value();
};
