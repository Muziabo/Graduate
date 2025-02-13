
// OrderEdit.tsx
import { Edit, SimpleForm, TextInput, DateInput } from "react-admin";

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="student" label="Student Name" />
            <TextInput source="gown" label="Gown Name" />
            <DateInput source="order_date" label="Order Date" />
        </SimpleForm>
    </Edit>
);

export default OrderEdit;
