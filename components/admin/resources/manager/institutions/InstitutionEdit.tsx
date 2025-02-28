// InstitutionEdit.tsx
import { Edit, SimpleForm, TextInput, DateInput, BooleanInput, required, useNotify, useRedirect } from "react-admin";



const InstitutionEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify('Institution updated successfully!');
        redirect('/admin/institutions');
    };

    return (
        <Edit onSuccess={onSuccess}>
            <SimpleForm>
                <TextInput source="name" label="Institution Name" validate={required()} />
                <TextInput source="description" label="Description" />
                <TextInput source="email" label="Contact Email" validate={required()} />
                <TextInput source="phone" label="Phone Number" />
                <TextInput source="type" label="Type (e.g., University, College)" />
                <TextInput source="category" label="Category (e.g., Public, Private)" />
                <DateInput source="established_at" label="Established Date" validate={required()} />
                <BooleanInput source="is_active" label="Is Active?" />
            </SimpleForm>
        </Edit>
    );
};



export default InstitutionEdit;
