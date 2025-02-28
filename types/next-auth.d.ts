import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            role: string;
            institutionId?: string;
        }
    }

    interface JWT {
        id: string;
        email?: string;
        role?: string;
        institutionId?: string;
        institutionName?: string;
    }
}
