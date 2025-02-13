
// InstitutionShow.tsx
import { Show, SimpleShowLayout, TextField } from "react-admin";

const InstitutionShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Institution Name" />
            <TextField source="address" label="Address" />
            <TextField source="email" label="Contact Email" />
        </SimpleShowLayout>
    </Show>
);

export default InstitutionShow;