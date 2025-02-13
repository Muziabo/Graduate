// InstitutionEdit.tsx
import { Edit, SimpleForm, TextInput, required } from "react-admin";

const InstitutionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Institution Name" validate={required()} />
            <TextInput source="address" label="Address" />
            <TextInput source="email" label="Contact Email" />
        </SimpleForm>
    </Edit>
);

export default InstitutionEdit;
