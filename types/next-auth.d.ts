import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            institutionId: string;
            id: string;
            email: string;
            role?: string;
            name?: string | null;
            institution?: string; // Add instAdmin to session
        };
    }

    interface User {
        id: string;
        email: string;
        role?: string;
        name?: string | null;
        institution?: string; // Add instAdmin to User type
    }

    interface Session {
        accessToken?: string;
    }

    interface JWT {
        id: string;
        email: string;
        role?: string;
        name?: string | null;
        institution?: string; // Add instAdmin to JWT
    }
}
