import { Check, FilterAltOutlined } from "@mui/icons-material";
import {
  Button,
  Divider,
  Fab,
  FormControl,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Filter, dbConnector } from "../../../api/db-connector";
import { useQuery } from "react-query";
import { MetaCommunes } from "../../../models/MetaCommunes.model";
import { flatMap, orderBy, uniq } from "lodash";
import { titlecase } from "../../../utils/titlecase";

const options = [
  {
    label: "Comuna",
    key: "comuna",
  },
  {
    label: "Urbanización",
    key: "urbanizacion",
  },
];

interface FilterMenuProps {
  filter: Filter | null;
  setFilter: (filter: Filter | null) => void;
  disabled?: boolean;
}

const getCommunes = () =>
  dbConnector
    .getOne<MetaCommunes>("meta", "communes")
    .then((doc) => (doc ? doc.data : []));

export const FilterMenu = ({
  filter,
  setFilter,
  disabled = false,
}: FilterMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterKey, setFilterKey] = useState(filter?.key || "comuna");
  const [filterValue, setFilterValue] = useState(filter?.value || "coquimbo");

  const { data } = useQuery(["meta", "communes"], getCommunes);
  let items: string[] = [];
  if (data) {
    items =
      filterKey === "comuna"
        ? orderBy(data.map((c) => c.name))
        : orderBy(uniq(flatMap(data, (c) => c.towns)));
  }

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (action?: () => void) => {
    setAnchorEl(null);
    action && action();
  };

  const handleFilter = () => {
    const filter: Filter = {
      key: filterKey,
      value: filterValue,
      operator: "==",
    };
    setFilter(filter);
    handleClose();
  };

  const cleanFilter = () => {
    setFilter(null);
    handleClose();
  };

  const isDisabled = Boolean(
    filter && filterKey === filter.key && filterValue === filter.value
  );

  return (
    <>
      <Fab
        onClick={handleClick}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        size="medium"
        color={filter ? "primary" : "default"}
        disabled={disabled}
      >
        <FilterAltOutlined />
      </Fab>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          sx: {
            width: "100%",
          },
        }}
      >
        <MenuItem disableRipple sx={{ margin: 0 }}>
          <Typography variant="h6">Filtrar por</Typography>
        </MenuItem>
        {options.map(({ label, key }) => (
          <MenuItem key={key} onClick={() => setFilterKey(key)}>
            <ListItemIcon>{filterKey === key ? <Check /> : null}</ListItemIcon>
            {label}
          </MenuItem>
        ))}
        <Divider />
        <Stack spacing={2} sx={{ padding: "6px 16px" }}>
          {["comuna", "urbanizacion"].includes(filterKey) && (
            <FilterControl {...{ filterValue, setFilterValue }} data={items} />
          )}
          {filterKey === "fechaInst" && <p>En desarrollo</p>}
          <Button
            disabled={isDisabled}
            onClick={handleFilter}
            variant="contained"
          >
            Filtrar
          </Button>
          <Button onClick={cleanFilter}>Quitar filtro</Button>
        </Stack>
      </Menu>
    </>
  );
};

interface FilterControlProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  data: string[];
}
const FilterControl = ({
  filterValue,
  setFilterValue,
  data,
}: FilterControlProps) => {
  const label = "Elegir una opción";
  return (
    <FormControl fullWidth>
      <InputLabel id="commune-select-label">{label}</InputLabel>
      <Select
        labelId="commune-select-label"
        label={label}
        id="commune-select"
        value={filterValue}
        onChange={(ev) => setFilterValue(ev.target.value)}
      >
        {data.map((item: string, i: number) => (
          <MenuItem key={i} value={item}>
            {titlecase(item)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
