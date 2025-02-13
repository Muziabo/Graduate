import { getSession } from "next-auth/react";

// Existing function
export function withRoleProtection(role: string) {
    return function (PageComponent: any) {
        const ProtectedPage = (props: any) => {
            const { session } = props;

            if (session?.user?.role !== role) {
                return <h1>Access Denied</h1>; // Redirect or show error
            }

            return <PageComponent {...props} />;
        };

        ProtectedPage.getInitialProps = async (ctx: any) => {
            const session = await getSession(ctx);
            return { session };
        };

        return ProtectedPage;
    };
}

// New checkAuth function
export async function checkAuth() {
    const session = await getSession(); // Gets the current session
    return session ? { isAuthenticated: true, user: session.user } : { isAuthenticated: false };
}