// GownEdit.tsx
import { Edit, SimpleForm, TextInput, required } from "react-admin";

const GownEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Gown Name" validate={required()} />
            <TextInput source="size" label="Size" />
            <TextInput source="price" label="Price" />
        </SimpleForm>
    </Edit>
);

export default GownEdit;
