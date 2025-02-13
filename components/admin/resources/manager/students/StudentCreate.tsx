import {Create, SimpleForm, TextInput, SelectInput, required, ReferenceInput} from "react-admin";

const StudentCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="studentId" label="Student ID" validate={required()} />
            <TextInput source="name" label="Full Name" validate={required()} />
            <TextInput source="email" label="Email" validate={required()} />
            <TextInput source="phone" label="Phone Number" />

            {/* Institution dropdown selection */}
            <ReferenceInput source="InstitutionId" reference="institutions">
                <SelectInput optionText="name" label="Institution" validate={required()} />
            </ReferenceInput>

        </SimpleForm>
    </Create>
);

export default StudentCreate;
