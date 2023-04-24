import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useLayoutContext } from "../../../layout/LayoutContext";
import { CustomerDetails } from "./CustomerDetails";
import { StateIcon } from "./StateIcon";
import { Customer } from "../../../classes/Customer";

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
              <br /> {customer.getCommune()} &nbsp;&nbsp;|&nbsp;&nbsp;
              {customer.getDate("instalacion")}
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
