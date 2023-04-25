import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useLayoutContext } from "../../../layout/LayoutContext";
import { CustomerDetails } from "./CustomerDetails";
import { StateIcon } from "./StateIcon";
import { Customer } from "../../../classes/Customer";
import {
  HomeRepairServiceOutlined,
  PersonOffOutlined,
} from "@mui/icons-material";

interface CustomerListItemProps {
  customer: Customer;
  style: any;
}

export const CustomerListItem = ({
  customer,
  style,
}: CustomerListItemProps) => {
  const { setDrawerContent } = useLayoutContext();
  const selectCustomer = (customer: Customer) =>
    setDrawerContent(<CustomerDetails customer={customer} />);

  return (
    <ListItem
      style={style}
      onClick={() => selectCustomer(customer)}
      key={customer.getId()}
      disablePadding
    >
      <ListItemButton disableRipple>
        <ListItemIcon>
          {<StateIcon daysLate={customer.getDaysLate()} />}
        </ListItemIcon>
        <ListItemText
          primary={customer.getName()}
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                {customer.getRut()}
              </Typography>
              <span style={{ display: "flex", gap: "16px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    width: "50%",
                  }}
                >
                  <HomeRepairServiceOutlined fontSize="small" />
                  <span>{customer.getDateAgo("instalacion")}</span>
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <PersonOffOutlined fontSize="small" />
                  <span>{customer.getDaysToLimitDate()}</span>
                </span>
              </span>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
