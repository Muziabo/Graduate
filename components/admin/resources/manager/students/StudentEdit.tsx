
// StudentEdit.tsx
import { Edit, SimpleForm, TextInput, required } from "react-admin";

const StudentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="first_name" label="First Name" validate={required()} />
            <TextInput source="last_name" label="Last Name" validate={required()} />
            <TextInput source="email" label="Email" validate={required()} />
        </SimpleForm>
    </Edit>
);

export default StudentEdit;