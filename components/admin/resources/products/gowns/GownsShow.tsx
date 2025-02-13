
// GownShow.tsx
import { Show, SimpleShowLayout, TextField } from "react-admin";

const GownShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Gown Name" />
            <TextField source="size" label="Size" />
            <TextField source="price" label="Price" />
        </SimpleShowLayout>
    </Show>
);

export default GownShow;
