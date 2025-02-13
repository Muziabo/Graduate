import { Create, SimpleForm, TextInput, DateInput, BooleanInput, required } from "react-admin";

const InstitutionCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Institution Name" validate={required()} />
            <TextInput source="description" label="Description" />
            <TextInput source="email" label="Email" validate={required()} />
            <TextInput source="phone" label="Phone Number" />
            <TextInput source="type" label="Type (e.g., University, College)" />
            <TextInput source="category" label="Category(e.g., Public, Private)" />
            <DateInput source="established_at" label="Established Date" validate={required()} />
            <BooleanInput source="is_active" label="Is Active?" />
        </SimpleForm>
    </Create>
);

export default InstitutionCreate;
