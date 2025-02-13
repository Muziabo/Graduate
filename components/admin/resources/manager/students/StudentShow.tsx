// StudentShow.tsx
import { Show, SimpleShowLayout, TextField } from "react-admin";

const StudentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="first_name" label="First Name" />
            <TextField source="last_name" label="Last Name" />
            <TextField source="email" label="Email" />
        </SimpleShowLayout>
    </Show>
);
export default StudentShow;