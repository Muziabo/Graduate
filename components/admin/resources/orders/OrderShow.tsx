
// OrderShow.tsx
import { Show, SimpleShowLayout, TextField, DateField } from "react-admin";

const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="Order ID" />
            <TextField source="student" label="Student Name" />
            <TextField source="gown" label="Gown Name" />
            <DateField source="order_date" label="Order Date" />
        </SimpleShowLayout>
    </Show>
);

export default OrderShow;