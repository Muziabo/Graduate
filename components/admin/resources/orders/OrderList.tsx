
// OrderList.tsx
import { List, Datagrid, TextField, DateField } from "react-admin";

const OrderList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="Order ID" />
            <TextField source="student" label="Student Name" />
            <TextField source="gown" label="Gown Name" />
            <DateField source="order_date" label="Order Date" />
        </Datagrid>
    </List>
);

export default OrderList;
