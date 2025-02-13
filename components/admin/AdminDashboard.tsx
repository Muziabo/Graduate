import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import authProvider from "@/provider/authProvider";
import dataProvider from "@/lib/dataProvider";
import Dashboard from "@/components/admin/Dashboard";
import CustomLayout from "@/components/admin/CustomLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

// Students
import { StudentList } from "@/components/admin/resources/manager/students/StudentList";
import StudentEdit from "@/components/admin/resources/manager/students/StudentEdit";
import StudentShow from "@/components/admin/resources/manager/students/StudentShow";

// Institutions
import { InstitutionList } from "@/components/admin/resources/manager/institutions/InstitutionList";
import InstitutionEdit from "@/components/admin/resources/manager/institutions/InstitutionEdit";
import InstitutionShow from "@/components/admin/resources/manager/institutions/InstitutionShow";

// Gowns
import { GownList } from "./resources/products/gowns/GownsList";
import GownEdit from "./resources/products/gowns/GownsEdit";
import GownShow from "./resources/products/gowns/GownsShow";

// Orders
import OrderList from "@/components/admin/resources/orders/OrderList";
import OrderEdit from "@/components/admin/resources/orders/OrderEdit";
import OrderShow from "@/components/admin/resources/orders/OrderShow";
import InstitutionCreate from "@/components/admin/resources/manager/institutions/InstitutionCreate";
import StudentCreate from "@/components/admin/resources/manager/students/StudentCreate";

// System Admin
import SystemAdminEdit from "@/components/admin/resources/administrator/system/SystemAdminEdit";
import SystemAdminShow from "@/components/admin/resources/administrator/system/SystemAdminShow";

// Institution Admin
import InstAdminEdit from "@/components/admin/resources/administrator/instAdmin/InstAdminEdit";
import InstAdminShow from "@/components/admin/resources/administrator/instAdmin/InstAdminShow";

// Gown Create Form
import GownCreateForm from "@/components/admin/GownCreateForm";

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTITUTION_ADMIN")) {
            router.push("/admin/login");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INSTITUTION_ADMIN")) {
        return <div>Unauthorized</div>;
    }

    return (
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            dashboard={Dashboard}
            layout={(props) => <CustomLayout {...props} role={session.user.role} />} // Pass role to CustomLayout
        >
            <Resource
                name="students"
                list={StudentList}
                create={StudentCreate} // Added Create
                edit={StudentEdit}
                show={StudentShow}
                options={{ label: "Students" }}
            />
            {session.user.role === "ADMIN" && (
                <Resource
                    name="institutions"
                    list={InstitutionList}
                    create={InstitutionCreate} // Added Create
                    edit={InstitutionEdit}
                    show={InstitutionShow}
                    options={{ label: "Institutions" }}
                />
            )}
            <Resource
                name="gowns"
                list={GownList}
                edit={GownEdit}
                show={GownShow}
                options={{ label: "Gowns" }}
            />
            <Resource
                name="orders"
                list={OrderList}
                edit={OrderEdit}
                show={OrderShow}
                options={{ label: "Orders" }}
            />

            {session.user.role === "ADMIN" && (
                <Resource
                    name="system"
                    edit={SystemAdminEdit}
                    show={SystemAdminShow}
                    options={{ label: "System User" }}
                />
            )}

            {session.user.role === "ADMIN" && (
                <Resource
                    name="system"
                    edit={InstAdminEdit}
                    show={InstAdminShow}
                    options={{ label: "Institution Admin" }}
                />
            )}

            {session.user.role === "INSTITUTION_ADMIN" && (
                <CustomRoutes>
                    <Route path="/create-gown" element={<GownCreateForm />} />
                </CustomRoutes>
            )}
        </Admin>
    );
};

export default AdminDashboard;