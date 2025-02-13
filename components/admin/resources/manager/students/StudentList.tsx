import { List, Datagrid, TextField, EmailField, FunctionField } from "react-admin";
import { useSession } from "next-auth/react";

export const StudentList = (props: any) => {
    const { data: session } = useSession();

    return (
        <List {...props} filter={{ institutionId: session?.user.institutionId }}>
            <Datagrid rowClick="edit">
                <TextField source="studentId" label="Student ID" /> {/* Display studentId */}
                <TextField source="name" label="Name" />
                <EmailField source="email" label="Email" />
                <TextField source="role" label="Role" />
                <TextField source="institutionId" label="Institution ID" /> {/* Display institutionId */}
                <FunctionField
                    label="Status"
                    render={(record: any) => (record.active ? "Active" : "Inactive")}
                />
            </Datagrid>
        </List>
    );
};