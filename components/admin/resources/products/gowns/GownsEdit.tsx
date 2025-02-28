// GownEdit.tsx
import { Edit, SimpleForm, TextInput, required, useNotify, useRedirect } from "react-admin";


const GownEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify('Gown updated successfully!');
        redirect('/admin/gowns');
    };

    return (
        <Edit onSuccess={onSuccess}>
            <SimpleForm>
                <TextInput source="name" label="Gown Name" validate={required()} />
                <TextInput source="size" label="Size" />
                <TextInput source="price" label="Price" validate={required()} />
            </SimpleForm>
        </Edit>
    );
};


export default GownEdit;
