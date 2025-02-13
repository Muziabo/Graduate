import { List, Datagrid, TextField, NumberField, BooleanField, FunctionField } from "react-admin";

export const GownList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="name" label="Name" />
            <TextField source="size" label="Size" />
            <NumberField source="price" label="Price" />
            <TextField source="category" label="Category" />
            <TextField source="type" label="Type" />
            <BooleanField source="inStock" label="In Stock" />
            <TextField source="customSize" label="Custom Size" />
            <TextField source="Institution.name" label="Institution" />
            <FunctionField
                label="Images"
                render={(record: any) => (
                    record.images && record.images.length > 0 ? (
                        <img src={record.images[0]} alt={record.name} style={{ width: 50, height: 50 }} />
                    ) : "No Image"
                )}
            />
        </Datagrid>
    </List>
);