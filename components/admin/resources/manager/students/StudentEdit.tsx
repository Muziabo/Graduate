
// StudentEdit.tsx
import { Edit, SimpleForm, TextInput, required, useNotify, useRedirect } from "react-admin";


const StudentEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify('Student updated successfully!');
        redirect('/admin/students');
    };

    return (
        <Edit onSuccess={onSuccess}>
            <SimpleForm>
                <TextInput source="first_name" label="First Name" validate={required()} />
                <TextInput source="last_name" label="Last Name" validate={required()} />
                <TextInput source="email" label="Email" validate={required()} />
            </SimpleForm>
        </Edit>
    );
};


export default StudentEdit;
