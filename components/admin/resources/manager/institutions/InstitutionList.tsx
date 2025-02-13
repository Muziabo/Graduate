import { List, Datagrid, TextField } from "react-admin";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const InstitutionList = (props: any) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (!session || session.user.role !== "ADMIN") {
            router.push("/admin/login");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session || session.user.role !== "ADMIN") {
        return <div>Unauthorized</div>;
    }

    return (
        <List {...props}>
            <Datagrid rowClick="edit">
                <TextField source="id" label="ID" />
                <TextField source="name" label="Institution Name" />
                <TextField source="type" label="Type" />
                <TextField source="category" label="Category" />
            </Datagrid>
        </List>
    );
};